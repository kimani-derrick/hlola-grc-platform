// Utility functions for consistent date formatting across server and client

/**
 * Formats a date string consistently for SSR to prevent hydration mismatches
 * @param dateString - Date string in ISO format or similar
 * @returns Formatted date string in MM/DD/YYYY format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${day}/${year}`;
}

/**
 * Formats a date string for display with more readable format
 * @param dateString - Date string in ISO format or similar
 * @returns Formatted date string in MMM DD, YYYY format
 */
export function formatDateReadable(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = String(date.getDate()).padStart(2, '0');
  return `${month} ${day}, ${year}`;
}

/**
 * Gets current date formatted consistently
 * @returns Current date in MM/DD/YYYY format
 */
export function getCurrentDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${month}/${day}/${year}`;
}
