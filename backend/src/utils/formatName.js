// utils/formatName.js

/**
 * Formats a name string:
 * - Trims whitespace
 * - Normalizes spaces
 * - Capitalizes each word
 * 
 * @param {string} v - Input name
 * @returns {string} - Formatted name
 */
export function formatName(v) {
  return v
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());
}
