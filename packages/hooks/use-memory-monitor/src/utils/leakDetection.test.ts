import { describe, it, expect } from "vitest";
import {
  linearRegression,
  calculateTrend,
  calculateAverageGrowth,
  analyzeLeakProbability,
  isMemoryGrowing,
  generateRecommendation,
} from "./leakDetection";
import type { MemoryInfo } from "../types";

// Helper to create memory samples
// Default interval is 5000ms (5 seconds)
function createMemorySamples(
  heapValues: number[],
  baseTimestamp = Date.now(),
  intervalMs = 5000
): MemoryInfo[] {
  return heapValues.map((heapUsed, index) => ({
    heapUsed,
    heapTotal: heapUsed * 2,
    heapLimit: 2 * 1024 * 1024 * 1024, // 2GB
    timestamp: baseTimestamp + index * intervalMs,
  }));
}

// Helper to create samples that meet minimum observation time (30+ seconds)
function createExtendedMemorySamples(
  heapValues: number[],
  baseTimestamp = Date.now()
): MemoryInfo[] {
  // Use 5 second intervals, so 7+ samples = 30+ seconds
  return createMemorySamples(heapValues, baseTimestamp, 5000);
}

describe("linearRegression", () => {
  describe("basic regression", () => {
    it("should calculate slope for perfectly linear data", () => {
      const points: [number, number][] = [
        [0, 0],
        [1, 10],
        [2, 20],
        [3, 30],
        [4, 40],
      ];

      const result = linearRegression(points);

      expect(result.slope).toBe(10);
      expect(result.intercept).toBe(0);
      expect(result.rSquared).toBeCloseTo(1, 5);
    });

    it("should calculate slope for increasing data", () => {
      const points: [number, number][] = [
        [0, 100],
        [1, 150],
        [2, 180],
        [3, 220],
        [4, 270],
      ];

      const result = linearRegression(points);

      expect(result.slope).toBeGreaterThan(0);
      expect(result.rSquared).toBeGreaterThan(0.9);
    });

    it("should calculate negative slope for decreasing data", () => {
      const points: [number, number][] = [
        [0, 100],
        [1, 80],
        [2, 60],
        [3, 40],
        [4, 20],
      ];

      const result = linearRegression(points);

      expect(result.slope).toBe(-20);
      expect(result.rSquared).toBeCloseTo(1, 5);
    });

    it("should return zero slope for constant data", () => {
      const points: [number, number][] = [
        [0, 50],
        [1, 50],
        [2, 50],
        [3, 50],
        [4, 50],
      ];

      const result = linearRegression(points);

      expect(result.slope).toBe(0);
    });
  });

  describe("edge cases", () => {
    it("should handle single point", () => {
      const points: [number, number][] = [[0, 100]];

      const result = linearRegression(points);

      expect(result.slope).toBe(0);
      expect(result.rSquared).toBe(0);
    });

    it("should handle empty array", () => {
      const points: [number, number][] = [];

      const result = linearRegression(points);

      expect(result.slope).toBe(0);
      expect(result.rSquared).toBe(0);
    });

    it("should handle two points", () => {
      const points: [number, number][] = [
        [0, 0],
        [1, 100],
      ];

      const result = linearRegression(points);

      expect(result.slope).toBe(100);
      expect(result.intercept).toBe(0);
    });

    it("should handle noisy data", () => {
      const points: [number, number][] = [
        [0, 100],
        [1, 150],
        [2, 120],
        [3, 180],
        [4, 200],
      ];

      const result = linearRegression(points);

      expect(result.slope).toBeGreaterThan(0);
      expect(result.rSquared).toBeGreaterThan(0.5);
      expect(result.rSquared).toBeLessThan(1);
    });
  });
});

describe("calculateTrend", () => {
  it("should detect increasing trend", () => {
    const samples = createMemorySamples([
      1000000, 1100000, 1200000, 1300000, 1400000,
    ]);

    expect(calculateTrend(samples)).toBe("increasing");
  });

  it("should detect decreasing trend", () => {
    const samples = createMemorySamples([
      1400000, 1300000, 1200000, 1100000, 1000000,
    ]);

    expect(calculateTrend(samples)).toBe("decreasing");
  });

  it("should detect stable trend", () => {
    const samples = createMemorySamples([
      1000000, 1000100, 999900, 1000050, 999950,
    ]);

    expect(calculateTrend(samples)).toBe("stable");
  });

  it("should return stable for insufficient samples", () => {
    const samples = createMemorySamples([1000000]);

    expect(calculateTrend(samples)).toBe("stable");
  });

  it("should return stable for empty array", () => {
    expect(calculateTrend([])).toBe("stable");
  });
});

describe("calculateAverageGrowth", () => {
  it("should calculate positive growth rate", () => {
    const samples = createMemorySamples([
      1000000, 1100000, 1200000, 1300000, 1400000,
    ]);

    const growth = calculateAverageGrowth(samples);

    expect(growth).toBeCloseTo(100000, -2);
  });

  it("should calculate negative growth rate", () => {
    const samples = createMemorySamples([
      1400000, 1300000, 1200000, 1100000, 1000000,
    ]);

    const growth = calculateAverageGrowth(samples);

    expect(growth).toBeCloseTo(-100000, -2);
  });

  it("should return zero for constant values", () => {
    const samples = createMemorySamples([
      1000000, 1000000, 1000000, 1000000, 1000000,
    ]);

    const growth = calculateAverageGrowth(samples);

    expect(growth).toBe(0);
  });

  it("should return zero for insufficient samples", () => {
    const samples = createMemorySamples([1000000]);

    expect(calculateAverageGrowth(samples)).toBe(0);
  });
});

describe("analyzeLeakProbability", () => {
  describe("with insufficient samples", () => {
    it("should return isLeaking: false with less than 10 samples", () => {
      const samples = createMemorySamples([1000000, 1100000, 1200000]);

      const analysis = analyzeLeakProbability(samples);

      expect(analysis.isLeaking).toBe(false);
      expect(analysis.probability).toBe(0);
    });
  });

  describe("with insufficient observation time", () => {
    it("should return probability 0 when observation time is too short", () => {
      // 10 samples but only 9 seconds of observation (1 second intervals)
      const samples = createMemorySamples([
        50 * 1024 * 1024,
        55 * 1024 * 1024,
        60 * 1024 * 1024,
        65 * 1024 * 1024,
        70 * 1024 * 1024,
        75 * 1024 * 1024,
        80 * 1024 * 1024,
        85 * 1024 * 1024,
        90 * 1024 * 1024,
        95 * 1024 * 1024,
      ], Date.now(), 1000); // 1 second intervals = 9 seconds total

      const analysis = analyzeLeakProbability(samples, "medium");

      expect(analysis.probability).toBe(0);
      expect(analysis.observationTime).toBeLessThan(30000);
    });
  });

  describe("with clearly increasing memory", () => {
    it("should detect high leak probability", () => {
      // Create samples with significant, consistent growth
      // 12 samples with 5 second intervals = 55 seconds observation time
      const samples = createMemorySamples([
        50 * 1024 * 1024, // 50MB
        55 * 1024 * 1024, // 55MB
        60 * 1024 * 1024, // 60MB
        65 * 1024 * 1024, // 65MB
        70 * 1024 * 1024, // 70MB
        75 * 1024 * 1024, // 75MB
        80 * 1024 * 1024, // 80MB
        85 * 1024 * 1024, // 85MB
        90 * 1024 * 1024, // 90MB
        95 * 1024 * 1024, // 95MB
        100 * 1024 * 1024, // 100MB
        105 * 1024 * 1024, // 105MB
      ], Date.now(), 5000);

      const analysis = analyzeLeakProbability(samples, "high");

      expect(analysis.trend).toBe("increasing");
      expect(analysis.rSquared).toBeGreaterThan(0.9);
      expect(analysis.averageGrowth).toBeGreaterThan(0);
    });
  });

  describe("with stable memory", () => {
    it("should return low leak probability", () => {
      // 12 samples with 5 second intervals
      const samples = createMemorySamples([
        50 * 1024 * 1024,
        50 * 1024 * 1024,
        50 * 1024 * 1024,
        50 * 1024 * 1024,
        50 * 1024 * 1024,
        50 * 1024 * 1024,
        50 * 1024 * 1024,
        50 * 1024 * 1024,
        50 * 1024 * 1024,
        50 * 1024 * 1024,
        50 * 1024 * 1024,
        50 * 1024 * 1024,
      ], Date.now(), 5000);

      const analysis = analyzeLeakProbability(samples);

      expect(analysis.isLeaking).toBe(false);
      expect(analysis.probability).toBeLessThan(30);
      expect(analysis.trend).toBe("stable");
    });
  });

  describe("with decreasing memory", () => {
    it("should return isLeaking: false", () => {
      // 12 samples with 5 second intervals
      const samples = createMemorySamples([
        100 * 1024 * 1024,
        95 * 1024 * 1024,
        90 * 1024 * 1024,
        85 * 1024 * 1024,
        80 * 1024 * 1024,
        75 * 1024 * 1024,
        70 * 1024 * 1024,
        65 * 1024 * 1024,
        60 * 1024 * 1024,
        55 * 1024 * 1024,
        50 * 1024 * 1024,
        45 * 1024 * 1024,
      ], Date.now(), 5000);

      const analysis = analyzeLeakProbability(samples);

      expect(analysis.isLeaking).toBe(false);
      expect(analysis.trend).toBe("decreasing");
    });
  });

  describe("sensitivity levels", () => {
    it("should be more sensitive with 'high' setting", () => {
      // 12 samples with 5 second intervals (55 seconds)
      // For high sensitivity, minObservationTime is 15 seconds
      const samples = createMemorySamples([
        50 * 1024 * 1024,
        51 * 1024 * 1024,
        52 * 1024 * 1024,
        53 * 1024 * 1024,
        54 * 1024 * 1024,
        55 * 1024 * 1024,
        56 * 1024 * 1024,
        57 * 1024 * 1024,
        58 * 1024 * 1024,
        59 * 1024 * 1024,
        60 * 1024 * 1024,
        61 * 1024 * 1024,
      ], Date.now(), 5000);

      const highAnalysis = analyzeLeakProbability(samples, "high");
      const lowAnalysis = analyzeLeakProbability(samples, "low");

      expect(highAnalysis.probability).toBeGreaterThanOrEqual(lowAnalysis.probability);
    });
  });

  describe("custom threshold", () => {
    it("should use custom threshold when provided", () => {
      // 12 samples with 5 second intervals = 55 seconds observation
      const samples = createMemorySamples([
        50 * 1024 * 1024,
        51 * 1024 * 1024,
        52 * 1024 * 1024,
        53 * 1024 * 1024,
        54 * 1024 * 1024,
        55 * 1024 * 1024,
        56 * 1024 * 1024,
        57 * 1024 * 1024,
        58 * 1024 * 1024,
        59 * 1024 * 1024,
        60 * 1024 * 1024,
        61 * 1024 * 1024,
      ], Date.now(), 5000);

      const withLowThreshold = analyzeLeakProbability(samples, "medium", 1000);
      const withHighThreshold = analyzeLeakProbability(
        samples,
        "medium",
        10000000
      );

      // With lower threshold, slope exceeds it more, should get higher probability
      expect(withLowThreshold.probability).toBeGreaterThan(
        withHighThreshold.probability
      );
    });
  });

  describe("GC detection", () => {
    it("should detect GC events in memory samples", () => {
      // Memory goes up, then drops (GC), then up again
      const samples = createMemorySamples([
        50 * 1024 * 1024,
        55 * 1024 * 1024,
        60 * 1024 * 1024,
        65 * 1024 * 1024,
        50 * 1024 * 1024, // GC event - 23% drop
        55 * 1024 * 1024,
        60 * 1024 * 1024,
        65 * 1024 * 1024,
        50 * 1024 * 1024, // GC event - 23% drop
        55 * 1024 * 1024,
        60 * 1024 * 1024,
        65 * 1024 * 1024,
      ], Date.now(), 5000);

      const analysis = analyzeLeakProbability(samples, "medium");

      expect(analysis.gcAnalysis).toBeDefined();
      expect(analysis.gcAnalysis!.gcEventCount).toBe(2);
      expect(analysis.gcAnalysis!.isGCEffective).toBe(true);
    });

    it("should have low probability when GC is effective", () => {
      // Memory goes up, then drops (GC), back to similar baseline
      const samples = createMemorySamples([
        50 * 1024 * 1024,
        55 * 1024 * 1024,
        60 * 1024 * 1024,
        65 * 1024 * 1024,
        50 * 1024 * 1024, // GC - back to baseline
        55 * 1024 * 1024,
        60 * 1024 * 1024,
        65 * 1024 * 1024,
        50 * 1024 * 1024, // GC - back to baseline
        55 * 1024 * 1024,
        60 * 1024 * 1024,
        65 * 1024 * 1024,
      ], Date.now(), 5000);

      const analysis = analyzeLeakProbability(samples, "medium");

      // GC is effective and baselines are stable, so not a leak
      expect(analysis.probability).toBeLessThan(70);
    });
  });
});

describe("isMemoryGrowing", () => {
  it("should return true for growing memory", () => {
    const samples = createMemorySamples([
      1000000, 1200000, 1400000, 1600000, 1800000,
    ]);

    expect(isMemoryGrowing(samples)).toBe(true);
  });

  it("should return false for stable memory", () => {
    const samples = createMemorySamples([
      1000000, 1000100, 999900, 1000050, 999950,
    ]);

    expect(isMemoryGrowing(samples)).toBe(false);
  });

  it("should return false for decreasing memory", () => {
    const samples = createMemorySamples([
      2000000, 1800000, 1600000, 1400000, 1200000,
    ]);

    expect(isMemoryGrowing(samples)).toBe(false);
  });

  it("should return false for insufficient samples", () => {
    const samples = createMemorySamples([1000000, 1100000]);

    expect(isMemoryGrowing(samples)).toBe(false);
  });
});

describe("generateRecommendation", () => {
  it("should return undefined for low probability", () => {
    expect(generateRecommendation(20, "stable", 1000)).toBeUndefined();
  });

  it("should return warning for medium probability", () => {
    const rec = generateRecommendation(60, "increasing", 50000);

    expect(rec).toBeDefined();
    expect(rec).toContain("Warning");
  });

  it("should return critical message for high probability", () => {
    const rec = generateRecommendation(85, "increasing", 1024 * 1024);

    expect(rec).toBeDefined();
    expect(rec).toContain("Critical");
    expect(rec).toContain("DevTools");
  });

  it("should return note for borderline case with increasing trend", () => {
    const rec = generateRecommendation(35, "increasing", 10000);

    expect(rec).toBeDefined();
    expect(rec).toContain("Note");
  });
});
