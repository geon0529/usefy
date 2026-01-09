import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes with clsx
 * Handles conditional classes and deduplication of conflicting Tailwind classes
 *
 * @param inputs - Class values to merge
 * @returns Merged class string
 *
 * @example
 * ```tsx
 * cn("px-4 py-2", "px-6") // => "px-6 py-2"
 * cn("bg-red-500", isActive && "bg-blue-500") // => "bg-blue-500" if isActive
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
