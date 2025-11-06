"use client";

export function shortenString(longString: string) {
  const minLength = 8; // We need at least 8 characters to show 4 + 4

  // 1. Check if the string is long enough
  if (!longString || longString.length <= minLength) {
    return longString; // Return the original string if it's too short
  }

  // 2. Extract the first 4 characters
  const start = longString.slice(0, 4);

  // 3. Extract the last 4 characters
  const end = longString.slice(-4);

  // 4. Combine and return the formatted string
  return `${start}...${end}`;
}
