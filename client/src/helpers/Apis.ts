"use client";

// Types
import { CustomError, FetcherOptions } from "@/types/apis";

const _requestHandler = async <T = any>(
  url: string,
  options: FetcherOptions = {}
): Promise<T> => {
  try {
    const response = await fetch(url, options);

    if (!response) {
      const networkError: CustomError = new Error(
        "Network error: Response is undefined."
      ) as CustomError;
      throw networkError;
    }

    let data: T | string | null = null;
    let text = "";

    // Attempt to read and parse the body
    try {
      text = await response.text();
      data = text ? JSON.parse(text) : null;
    } catch (parseError) {
      if (response.ok) {
        // Successful status but invalid or plain body
        return text as T;
      }
      data = text as T;
    }

    // HTTP status error handling (e.g., 404, 500)
    if (!response.ok) {
      const errorDetail: string =
        (data && typeof data === "object" && (data as any).message) ||
        (data as any).error
          ? (data as any).message || (data as any).error
          : response.statusText || "Unknown server error";

      const httpError: CustomError = new Error(
        `HTTP Error ${response.status}: ${errorDetail}`
      ) as CustomError;
      httpError.status = response.status;
      httpError.data = data;
      throw httpError;
    }

    return data as T;
  } catch (error) {
    const customError = error as CustomError;

    throw customError.message;
  }
};

/**
 * Helper function dedicated to GET requests, optimized for use as an SWR fetcher.
 * @template T The expected response type.
 * @param url The API endpoint URL.
 * @param options Optional fetch options (excluding body/method).
 */
export const fetchGet = async <T = any>(url: string): Promise<T> => {
  const token = localStorage.getItem("token");
  // GET is the default method, so we just call the handler directly.
  return _requestHandler<T>(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
};

/**
 * Helper function dedicated to POST requests for mutations.
 * @template T The expected response type.
 * @template V The type of the payload/body being sent.
 * @param url The API endpoint URL.
 * @param data The JSON payload to send in the request body.
 * @param options Optional fetch options (will override default POST settings).
 */
export const fetchPost = async <T = any, V = any>(
  url: string,
  data: V
): Promise<T> => {
  const token = localStorage.getItem("token");
  const postOptions: FetcherOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(data),
  };
  return _requestHandler<T>(url, postOptions);
};
