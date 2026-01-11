/**
 * Download a blob as a file
 *
 * @param blob - The blob to download
 * @param filename - The filename to save as
 *
 * @example
 * ```ts
 * const blob = new Blob(['hello'], { type: 'text/plain' });
 * downloadBlob(blob, 'hello.txt');
 * ```
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);

  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } finally {
    // Revoke the URL after a short delay to ensure download starts
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  }
}

/**
 * Generate a default filename for recordings
 *
 * @param timestamp - The recording timestamp
 * @param extension - The file extension (default: 'webm')
 * @returns Generated filename
 *
 * @example
 * ```ts
 * generateFilename(new Date()) // => 'screen-recording-2024-01-15-143052.webm'
 * ```
 */
export function generateFilename(
  timestamp: Date = new Date(),
  extension: string = "webm"
): string {
  const year = timestamp.getFullYear();
  const month = String(timestamp.getMonth() + 1).padStart(2, "0");
  const day = String(timestamp.getDate()).padStart(2, "0");
  const hours = String(timestamp.getHours()).padStart(2, "0");
  const minutes = String(timestamp.getMinutes()).padStart(2, "0");
  const seconds = String(timestamp.getSeconds()).padStart(2, "0");

  return `screen-recording-${year}-${month}-${day}-${hours}${minutes}${seconds}.${extension}`;
}

/**
 * Format bytes to human-readable size
 *
 * @param bytes - Size in bytes
 * @param decimals - Number of decimal places
 * @returns Formatted size string
 *
 * @example
 * ```ts
 * formatBytes(1024) // => '1 KB'
 * formatBytes(1048576) // => '1 MB'
 * formatBytes(1536, 1) // => '1.5 KB'
 * ```
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const index = Math.min(i, sizes.length - 1);

  return `${parseFloat((bytes / Math.pow(k, index)).toFixed(dm))} ${sizes[index]}`;
}
