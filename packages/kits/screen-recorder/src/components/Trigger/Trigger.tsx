import type { FC, ReactNode } from "react";
import clsx from "clsx";
import { TriggerIcon } from "./TriggerIcon";
import type { TriggerPosition } from "../../types";
import { ARIA_LABELS } from "../../constants";
import styles from "./Trigger.module.scss";

export interface TriggerProps {
  /**
   * Position of the trigger button
   */
  position?: TriggerPosition;
  /**
   * Custom content for the trigger button
   */
  children?: ReactNode;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Whether the trigger is disabled
   */
  disabled?: boolean;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Z-index for positioning
   */
  zIndex?: number;
}

const POSITION_STYLES: Record<TriggerPosition, string> = {
  "top-left": styles.topLeft,
  "top-right": styles.topRight,
  "bottom-left": styles.bottomLeft,
  "bottom-right": styles.bottomRight,
};

/**
 * Floating trigger button to start screen recording
 */
export const Trigger: FC<TriggerProps> = ({
  position = "bottom-right",
  children,
  onClick,
  disabled = false,
  className,
  zIndex = 9999,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ARIA_LABELS.triggerButton}
      className={clsx(
        styles.trigger,
        POSITION_STYLES[position],
        className
      )}
      style={{ zIndex }}
    >
      {children ?? (
        <>
          <TriggerIcon className={styles.icon} />
          <span>Record</span>
        </>
      )}
    </button>
  );
};
