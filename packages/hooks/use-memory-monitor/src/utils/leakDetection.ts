import type {
  BaselineAnalysis,
  GCAnalysis,
  GCEvent,
  LeakAnalysis,
  LeakProbabilityFactors,
  LeakSensitivity,
  MemoryInfo,
  Trend,
} from "../types";
import {
  BASELINE_GROWTH_THRESHOLD,
  GC_DETECTION_THRESHOLD,
  LEAK_PROBABILITY_THRESHOLD,
  LEAK_SENSITIVITY_CONFIG,
  MIN_LEAK_DETECTION_SAMPLES,
} from "../constants";

/**
 * Result of linear regression analysis
 */
export interface RegressionResult {
  /** Slope of the regression line (bytes per sample) */
  slope: number;
  /** Y-intercept of the regression line */
  intercept: number;
  /** R-squared value (coefficient of determination, 0-1) */
  rSquared: number;
}

/**
 * Perform simple linear regression on a set of points.
 * Uses the least squares method.
 *
 * @param points - Array of [x, y] coordinate pairs
 * @returns Regression result with slope, intercept, and R-squared
 */
export function linearRegression(points: [number, number][]): RegressionResult {
  const n = points.length;

  if (n < 2) {
    return { slope: 0, intercept: 0, rSquared: 0 };
  }

  // Calculate sums
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;

  for (const [x, y] of points) {
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
    sumY2 += y * y;
  }

  // Calculate slope and intercept
  const denominator = n * sumX2 - sumX * sumX;

  if (denominator === 0) {
    return { slope: 0, intercept: sumY / n, rSquared: 0 };
  }

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R-squared (coefficient of determination)
  const meanY = sumY / n;
  let ssTotal = 0; // Total sum of squares
  let ssResidual = 0; // Residual sum of squares

  for (const [x, y] of points) {
    const predicted = slope * x + intercept;
    ssTotal += Math.pow(y - meanY, 2);
    ssResidual += Math.pow(y - predicted, 2);
  }

  const rSquared = ssTotal === 0 ? 0 : 1 - ssResidual / ssTotal;

  return {
    slope,
    intercept,
    rSquared: Math.max(0, Math.min(1, rSquared)), // Clamp to [0, 1]
  };
}

/**
 * Calculate the memory trend from samples.
 *
 * @param samples - Array of memory info samples
 * @returns Trend direction
 */
export function calculateTrend(samples: MemoryInfo[]): Trend {
  if (samples.length < 2) {
    return "stable";
  }

  // Convert samples to [index, heapUsed] points
  const points: [number, number][] = samples.map((s, i) => [i, s.heapUsed]);
  const { slope } = linearRegression(points);

  // Normalize slope by average heap size for relative comparison
  const avgHeap = samples.reduce((sum, s) => sum + s.heapUsed, 0) / samples.length;
  const normalizedSlope = avgHeap > 0 ? slope / avgHeap : 0;

  // Use stricter thresholds
  if (normalizedSlope > 0.02) {
    return "increasing";
  }

  if (normalizedSlope < -0.02) {
    return "decreasing";
  }

  return "stable";
}

/**
 * Calculate average growth rate (bytes per sample).
 *
 * @param samples - Array of memory info samples
 * @returns Average growth rate in bytes per sample
 */
export function calculateAverageGrowth(samples: MemoryInfo[]): number {
  if (samples.length < 2) {
    return 0;
  }

  const points: [number, number][] = samples.map((s, i) => [i, s.heapUsed]);
  const { slope } = linearRegression(points);

  return slope;
}

/**
 * Detect GC events in memory samples.
 * A GC event is detected when memory drops significantly between samples.
 *
 * @param samples - Array of memory info samples
 * @param threshold - Minimum drop ratio to consider as GC (default: 0.10 = 10%)
 * @returns GC analysis result
 */
export function detectGCEvents(
  samples: MemoryInfo[],
  threshold: number = GC_DETECTION_THRESHOLD
): GCAnalysis {
  const gcEvents: GCEvent[] = [];

  if (samples.length < 2) {
    return {
      gcEventCount: 0,
      gcEvents: [],
      avgRecoveryRatio: 0,
      lastGCTimestamp: null,
      isGCEffective: false,
    };
  }

  for (let i = 1; i < samples.length; i++) {
    const prev = samples[i - 1];
    const curr = samples[i];
    const drop = prev.heapUsed - curr.heapUsed;
    const dropRatio = drop / prev.heapUsed;

    // Significant drop indicates GC
    if (dropRatio >= threshold) {
      gcEvents.push({
        sampleIndex: i,
        memoryBefore: prev.heapUsed,
        memoryAfter: curr.heapUsed,
        recoveryAmount: drop,
        recoveryRatio: dropRatio,
        timestamp: curr.timestamp,
      });
    }
  }

  const gcEventCount = gcEvents.length;
  const avgRecoveryRatio = gcEventCount > 0
    ? gcEvents.reduce((sum, e) => sum + e.recoveryRatio, 0) / gcEventCount
    : 0;
  const lastGCTimestamp = gcEventCount > 0
    ? gcEvents[gcEvents.length - 1].timestamp
    : null;

  // GC is effective if it recovers at least 15% on average
  const isGCEffective = avgRecoveryRatio >= 0.15;

  return {
    gcEventCount,
    gcEvents,
    avgRecoveryRatio,
    lastGCTimestamp,
    isGCEffective,
  };
}

/**
 * Calculate baseline from post-GC memory values.
 * Baseline represents the "floor" memory after GC cycles.
 *
 * @param samples - Array of memory info samples
 * @param gcEvents - Detected GC events
 * @returns Baseline analysis
 */
export function calculateBaseline(
  samples: MemoryInfo[],
  gcEvents: GCEvent[]
): BaselineAnalysis {
  if (samples.length === 0) {
    return {
      baselineHeap: 0,
      currentHeap: 0,
      growthFromBaseline: 0,
      growthRatio: 0,
      isBaselineEstablished: false,
      isSignificantGrowth: false,
    };
  }

  const currentHeap = samples[samples.length - 1].heapUsed;

  // If we have GC events, use post-GC values as baseline
  if (gcEvents.length >= 2) {
    const postGCValues = gcEvents.map(e => e.memoryAfter);
    const baselineHeap = postGCValues.reduce((sum, v) => sum + v, 0) / postGCValues.length;
    const growthFromBaseline = currentHeap - baselineHeap;
    const growthRatio = baselineHeap > 0 ? growthFromBaseline / baselineHeap : 0;

    return {
      baselineHeap,
      currentHeap,
      growthFromBaseline,
      growthRatio,
      isBaselineEstablished: true,
      isSignificantGrowth: growthRatio > BASELINE_GROWTH_THRESHOLD,
    };
  }

  // Without enough GC events, use minimum value as approximate baseline
  const minHeap = Math.min(...samples.map(s => s.heapUsed));
  const growthFromBaseline = currentHeap - minHeap;
  const growthRatio = minHeap > 0 ? growthFromBaseline / minHeap : 0;

  return {
    baselineHeap: minHeap,
    currentHeap,
    growthFromBaseline,
    growthRatio,
    isBaselineEstablished: false,
    isSignificantGrowth: growthRatio > BASELINE_GROWTH_THRESHOLD,
  };
}

/**
 * Analyze trend of post-GC baselines.
 * If baselines are increasing over time, it indicates a true leak.
 *
 * @param gcEvents - Detected GC events
 * @returns Trend of baseline growth
 */
export function analyzeBaselineTrend(gcEvents: GCEvent[]): {
  trend: Trend;
  slope: number;
  rSquared: number;
} {
  if (gcEvents.length < 2) {
    return { trend: "stable", slope: 0, rSquared: 0 };
  }

  // Use post-GC values indexed by event order
  const points: [number, number][] = gcEvents.map((e, i) => [i, e.memoryAfter]);
  const { slope, rSquared } = linearRegression(points);

  // Normalize by average post-GC memory
  const avgPostGC = gcEvents.reduce((sum, e) => sum + e.memoryAfter, 0) / gcEvents.length;
  const normalizedSlope = avgPostGC > 0 ? slope / avgPostGC : 0;

  let trend: Trend = "stable";
  if (normalizedSlope > 0.02) {
    trend = "increasing";
  } else if (normalizedSlope < -0.02) {
    trend = "decreasing";
  }

  return { trend, slope, rSquared };
}

/**
 * Calculate observation time from samples
 */
function calculateObservationTime(samples: MemoryInfo[]): number {
  if (samples.length < 2) return 0;
  return samples[samples.length - 1].timestamp - samples[0].timestamp;
}

/**
 * Generate a human-readable recommendation based on leak analysis.
 *
 * @param probability - Leak probability (0-100)
 * @param trend - Memory trend
 * @param averageGrowth - Average growth rate in bytes
 * @param gcAnalysis - GC analysis results
 * @returns Recommendation string
 */
export function generateRecommendation(
  probability: number,
  trend: Trend,
  averageGrowth: number,
  gcAnalysis?: GCAnalysis
): string | undefined {
  if (probability < 30) {
    return undefined;
  }

  const gcInfo = gcAnalysis && gcAnalysis.gcEventCount > 0
    ? ` GC has occurred ${gcAnalysis.gcEventCount} time(s) with ${(gcAnalysis.avgRecoveryRatio * 100).toFixed(0)}% average recovery.`
    : "";

  if (probability >= 80) {
    return `Critical: High probability of memory leak detected. Memory is growing at ${formatGrowthRate(averageGrowth)} per sample even after GC.${gcInfo} Consider profiling with browser DevTools.`;
  }

  if (probability >= 60) {
    return `Warning: Possible memory leak detected. Memory trend is ${trend}.${gcInfo} Monitor closely and check for retained references.`;
  }

  if (probability >= 30 && trend === "increasing") {
    return `Note: Memory usage is trending upward.${gcInfo} This may be normal for your application, but consider monitoring.`;
  }

  return undefined;
}

/**
 * Format growth rate for display.
 *
 * @param bytesPerSample - Growth rate in bytes per sample
 * @returns Formatted string
 */
function formatGrowthRate(bytesPerSample: number): string {
  const absBytes = Math.abs(bytesPerSample);

  if (absBytes >= 1024 * 1024) {
    return `${(bytesPerSample / (1024 * 1024)).toFixed(2)} MB`;
  }

  if (absBytes >= 1024) {
    return `${(bytesPerSample / 1024).toFixed(2)} KB`;
  }

  return `${bytesPerSample.toFixed(0)} bytes`;
}

/**
 * Calculate leak probability using multiple weighted factors.
 *
 * Factors:
 * - Slope contribution (0-30): How fast memory is growing
 * - R² contribution (0-20): How consistent the growth pattern is
 * - GC contribution (0-25): Whether GC fails to reclaim memory
 * - Time contribution (0-15): Longer observation = more confidence
 * - Baseline contribution (0-10): Whether post-GC baseline is rising
 */
function calculateWeightedProbability(
  slope: number,
  rSquared: number,
  gcAnalysis: GCAnalysis,
  baselineAnalysis: BaselineAnalysis,
  observationTime: number,
  config: typeof LEAK_SENSITIVITY_CONFIG["medium"]
): { probability: number; factors: LeakProbabilityFactors } {
  const factors: LeakProbabilityFactors = {
    slopeContribution: 0,
    rSquaredContribution: 0,
    gcContribution: 0,
    timeContribution: 0,
    baselineContribution: 0,
  };

  // 1. Slope contribution (max 30 points)
  if (slope > 0) {
    const slopeRatio = slope / config.minSlope;
    factors.slopeContribution = Math.min(30, slopeRatio * 15);
  }

  // 2. R² contribution (max 20 points)
  if (rSquared >= config.minR2) {
    const rSquaredBonus = (rSquared - config.minR2) / (1 - config.minR2);
    factors.rSquaredContribution = 10 + rSquaredBonus * 10;
  }

  // 3. GC contribution (max 25 points)
  // If GC is happening but not reclaiming memory, it's likely a leak
  if (gcAnalysis.gcEventCount >= config.minGCCycles) {
    if (!gcAnalysis.isGCEffective) {
      // GC is happening but not effective
      factors.gcContribution = 25;
    } else if (gcAnalysis.avgRecoveryRatio < 0.3) {
      // GC recovery is poor
      factors.gcContribution = 15;
    }
  } else if (gcAnalysis.gcEventCount === 0 && slope > 0) {
    // No GC detected but memory growing - could be early stage leak
    factors.gcContribution = 5;
  }

  // 4. Time contribution (max 15 points)
  if (observationTime >= config.minObservationTime) {
    const timeRatio = Math.min(2, observationTime / config.minObservationTime);
    factors.timeContribution = timeRatio * 7.5;
  }

  // 5. Baseline contribution (max 10 points)
  if (baselineAnalysis.isBaselineEstablished && baselineAnalysis.isSignificantGrowth) {
    factors.baselineContribution = 10;
  } else if (baselineAnalysis.isSignificantGrowth) {
    factors.baselineContribution = 5;
  }

  // Sum all contributions
  const rawProbability =
    factors.slopeContribution +
    factors.rSquaredContribution +
    factors.gcContribution +
    factors.timeContribution +
    factors.baselineContribution;

  // Apply sensitivity multiplier and clamp
  const probability = Math.min(100, Math.max(0, rawProbability * config.probabilityMultiplier));

  return { probability, factors };
}

/**
 * Analyze memory samples for potential leaks with enhanced algorithm.
 *
 * The enhanced algorithm considers:
 * 1. GC cycles - true leaks persist even after GC
 * 2. Baseline trend - post-GC memory should not grow over time
 * 3. Observation time - requires sufficient data before making judgment
 * 4. Multiple factors - weighted scoring system for accuracy
 *
 * @param samples - Array of memory info samples (minimum 10 recommended)
 * @param sensitivity - Detection sensitivity level
 * @param customThreshold - Optional custom growth threshold (bytes/sample)
 * @returns Leak analysis result
 */
export function analyzeLeakProbability(
  samples: MemoryInfo[],
  sensitivity: LeakSensitivity = "medium",
  customThreshold?: number
): LeakAnalysis {
  const config = LEAK_SENSITIVITY_CONFIG[sensitivity];
  const trend = calculateTrend(samples);
  const averageGrowth = calculateAverageGrowth(samples);

  // Not enough samples for reliable analysis
  if (samples.length < MIN_LEAK_DETECTION_SAMPLES) {
    return {
      isLeaking: false,
      probability: 0,
      trend,
      averageGrowth,
      rSquared: 0,
      samples,
      recommendation: undefined,
      confidence: 0,
    };
  }

  // Calculate observation time
  const observationTime = calculateObservationTime(samples);

  // Not enough observation time
  if (observationTime < config.minObservationTime) {
    return {
      isLeaking: false,
      probability: 0,
      trend,
      averageGrowth,
      rSquared: 0,
      samples,
      recommendation: undefined,
      observationTime,
      confidence: Math.round((observationTime / config.minObservationTime) * 50),
    };
  }

  // Perform linear regression
  const points: [number, number][] = samples.map((s, i) => [i, s.heapUsed]);
  const { slope, rSquared } = linearRegression(points);
  const threshold = customThreshold ?? config.minSlope;

  // Detect GC events
  const gcAnalysis = detectGCEvents(samples);

  // Calculate baseline
  const baselineAnalysis = calculateBaseline(samples, gcAnalysis.gcEvents);

  // Check baseline trend if we have enough GC cycles
  const baselineTrend = analyzeBaselineTrend(gcAnalysis.gcEvents);

  // Calculate weighted probability
  const { probability: rawProbability, factors } = calculateWeightedProbability(
    slope,
    rSquared,
    gcAnalysis,
    baselineAnalysis,
    observationTime,
    config
  );

  // Apply additional checks for false positive reduction
  let probability = rawProbability;

  // If GC is effective and baseline is stable, reduce probability
  if (gcAnalysis.isGCEffective && baselineTrend.trend !== "increasing") {
    probability = Math.max(0, probability - 20);
  }

  // If trend is decreasing or stable, cap probability
  if (trend === "decreasing") {
    probability = Math.min(probability, 10);
  } else if (trend === "stable") {
    probability = Math.min(probability, 30);
  }

  // If slope is negative or very small, cap probability
  if (slope <= 0 || slope < threshold * 0.3) {
    probability = Math.min(probability, 20);
  }

  // Round probability
  probability = Math.round(probability);

  // Calculate confidence based on data quality
  const confidence = Math.round(
    Math.min(100,
      (samples.length / 20) * 25 + // Sample count contribution
      (gcAnalysis.gcEventCount >= config.minGCCycles ? 25 : gcAnalysis.gcEventCount * 10) + // GC observation
      (observationTime / config.minObservationTime) * 25 + // Time contribution
      rSquared * 25 // Fit quality
    )
  );

  // Determine if leaking (using stricter threshold)
  const isLeaking = probability >= LEAK_PROBABILITY_THRESHOLD;

  return {
    isLeaking,
    probability,
    trend,
    averageGrowth: slope,
    rSquared,
    samples,
    recommendation: generateRecommendation(probability, trend, slope, gcAnalysis),
    gcAnalysis,
    baselineAnalysis,
    observationTime,
    confidence,
    factors,
  };
}

/**
 * Quick check if memory is trending upward (without full analysis).
 *
 * @param samples - Array of memory info samples
 * @returns True if memory appears to be growing
 */
export function isMemoryGrowing(samples: MemoryInfo[]): boolean {
  if (samples.length < 3) {
    return false;
  }

  const trend = calculateTrend(samples);
  return trend === "increasing";
}
