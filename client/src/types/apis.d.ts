"use client";

// Custom error structure for improved HTTP error details
export interface CustomError extends Error {
  status?: number;
  data?: any; // Raw response data
}

// Fetch options type
export type FetcherOptions = RequestInit;
