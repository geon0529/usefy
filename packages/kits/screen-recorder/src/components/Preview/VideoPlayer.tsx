import { forwardRef, useRef, useImperativeHandle, useState, useCallback, useEffect } from "react";
import { cn } from "../../utils/cn";
import { PlayIcon, PauseIcon } from "../Trigger/TriggerIcon";
import { ARIA_LABELS } from "../../constants";

export interface VideoPlayerProps {
  /**
   * Video source URL
   */
  src: string;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Whether to show controls
   */
  showControls?: boolean;
  /**
   * Auto-play on mount
   */
  autoPlay?: boolean;
  /**
   * Known duration in seconds (fallback for WebM files where duration may be Infinity)
   */
  knownDuration?: number;
}

export interface VideoPlayerRef {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
}

/**
 * Video player component with custom controls
 */
export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  ({ src, className, showControls = true, autoPlay = false, knownDuration }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(knownDuration || 0);

    // Expose controls via ref
    useImperativeHandle(ref, () => ({
      play: () => videoRef.current?.play(),
      pause: () => videoRef.current?.pause(),
      togglePlay: () => {
        if (isPlaying) {
          videoRef.current?.pause();
        } else {
          videoRef.current?.play();
        }
      },
    }));

    // Handle play state changes
    const handlePlay = useCallback(() => setIsPlaying(true), []);
    const handlePause = useCallback(() => setIsPlaying(false), []);
    const handleEnded = useCallback(() => setIsPlaying(false), []);

    // Handle time update
    const handleTimeUpdate = useCallback(() => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);

        // For WebM files, duration might become available during playback
        const videoDuration = videoRef.current.duration;
        if (isFinite(videoDuration) && videoDuration > 0) {
          setDuration(videoDuration);
        }
      }
    }, []);

    // Handle metadata loaded
    const handleLoadedMetadata = useCallback(() => {
      if (videoRef.current) {
        const videoDuration = videoRef.current.duration;
        // Only set if it's a valid finite number
        if (isFinite(videoDuration) && videoDuration > 0) {
          setDuration(videoDuration);
        }
      }
    }, []);

    // Handle duration change (WebM files may report duration later)
    const handleDurationChange = useCallback(() => {
      if (videoRef.current) {
        const videoDuration = videoRef.current.duration;
        if (isFinite(videoDuration) && videoDuration > 0) {
          setDuration(videoDuration);
        }
      }
    }, []);

    // Use knownDuration as fallback when video duration is not available
    useEffect(() => {
      if (knownDuration && knownDuration > 0 && (!duration || duration === 0)) {
        setDuration(knownDuration);
      }
    }, [knownDuration, duration]);

    // Handle seek
    const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const time = parseFloat(e.target.value);
      if (videoRef.current && isFinite(time)) {
        videoRef.current.currentTime = time;
        setCurrentTime(time);
      }
    }, []);

    // Toggle play/pause
    const togglePlay = useCallback(() => {
      if (isPlaying) {
        videoRef.current?.pause();
      } else {
        videoRef.current?.play();
      }
    }, [isPlaying]);

    // Format time as MM:SS
    const formatTime = (seconds: number): string => {
      if (!isFinite(seconds) || isNaN(seconds)) {
        return "00:00";
      }
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Get effective duration for display
    const effectiveDuration = isFinite(duration) && duration > 0
      ? duration
      : knownDuration || 0;

    return (
      <div className={cn("relative bg-black rounded-lg overflow-hidden", className)}>
        {/* Video element */}
        <video
          ref={videoRef}
          src={src}
          className="w-full h-auto"
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onDurationChange={handleDurationChange}
          autoPlay={autoPlay}
          playsInline
          aria-label={ARIA_LABELS.videoPlayer}
        />

        {/* Controls overlay */}
        {showControls && (
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0",
              "bg-gradient-to-t from-black/80 to-transparent",
              "p-3"
            )}
          >
            {/* Progress bar */}
            <div className="flex items-center gap-2 mb-2">
              <input
                type="range"
                min={0}
                max={effectiveDuration || 100}
                value={currentTime}
                onChange={handleSeek}
                className={cn(
                  "flex-1 h-1 rounded-full appearance-none cursor-pointer",
                  "bg-white/30",
                  "[&::-webkit-slider-thumb]:appearance-none",
                  "[&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3",
                  "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                )}
                aria-label="Video progress"
              />
            </div>

            {/* Play button and time */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  className={cn(
                    "p-1.5 rounded-full",
                    "hover:bg-white/20",
                    "transition-colors duration-150",
                    "focus:outline-none focus:ring-2 focus:ring-white/50"
                  )}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <PauseIcon className="w-4 h-4 text-white" />
                  ) : (
                    <PlayIcon className="w-4 h-4 text-white" />
                  )}
                </button>

                <span className="text-white/80 text-xs font-mono tabular-nums">
                  {formatTime(currentTime)} / {formatTime(effectiveDuration)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

VideoPlayer.displayName = "VideoPlayer";
