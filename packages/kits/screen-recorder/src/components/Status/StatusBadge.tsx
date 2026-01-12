import type { FC } from "react";
import clsx from "clsx";
import type { RecordingState } from "../../types";
import styles from "./StatusBadge.module.scss";

export interface StatusBadgeProps {
  /**
   * Current recording state
   */
  state: RecordingState;
  /**
   * Custom class name
   */
  className?: string;
}

type StatusConfig = {
  label: string;
  badgeClass: string;
  dotClass: string;
  labelClass: string;
};

/**
 * Status badge showing current recording state
 */
export const StatusBadge: FC<StatusBadgeProps> = ({ state, className }) => {
  const getStatusConfig = (): StatusConfig => {
    switch (state) {
      case "recording":
        return {
          label: "REC",
          badgeClass: styles.stateRecording,
          dotClass: styles.dotRecording,
          labelClass: styles.labelRecording,
        };
      case "paused":
        return {
          label: "PAUSED",
          badgeClass: styles.statePaused,
          dotClass: styles.dotPaused,
          labelClass: styles.labelPaused,
        };
      case "requesting":
        return {
          label: "REQUESTING",
          badgeClass: styles.stateRequesting,
          dotClass: styles.dotRequesting,
          labelClass: styles.labelRequesting,
        };
      case "countdown":
        return {
          label: "STARTING",
          badgeClass: styles.stateCountdown,
          dotClass: styles.dotCountdown,
          labelClass: styles.labelCountdown,
        };
      case "stopped":
        return {
          label: "STOPPED",
          badgeClass: styles.stateStopped,
          dotClass: styles.dotStopped,
          labelClass: styles.labelStopped,
        };
      case "error":
        return {
          label: "ERROR",
          badgeClass: styles.stateError,
          dotClass: styles.dotError,
          labelClass: styles.labelError,
        };
      default:
        return {
          label: "IDLE",
          badgeClass: styles.stateIdle,
          dotClass: styles.dotIdle,
          labelClass: styles.labelIdle,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={clsx(styles.badge, config.badgeClass, className)}
      role="status"
      aria-live="polite"
    >
      <span className={clsx(styles.dot, config.dotClass)} />
      <span className={clsx(styles.label, config.labelClass)}>
        {config.label}
      </span>
    </div>
  );
};
