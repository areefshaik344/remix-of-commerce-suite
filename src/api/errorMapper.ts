/**
 * API Error Mapper
 * Maps HTTP error responses into user-friendly messages.
 * Aligned with Spring Boot's standard error response format.
 */

import type { AxiosError } from "axios";
import type { ApiErrorResponse, FieldError } from "@/types/api";

export interface MappedApiError {
  message: string;
  fieldErrors: FieldError[];
  statusCode: number;
  errorCode?: string;
  isNetworkError: boolean;
  isTimeout: boolean;
  isServerError: boolean;
  isAuthError: boolean;
  isValidationError: boolean;
}

const HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: "The request was invalid. Please check your input.",
  401: "Your session has expired. Please log in again.",
  403: "You don't have permission to perform this action.",
  404: "The requested resource was not found.",
  409: "This action conflicts with existing data.",
  422: "Please fix the validation errors and try again.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "Something went wrong on our end. Please try again later.",
  502: "Our servers are temporarily unavailable. Please try again.",
  503: "Service is temporarily unavailable. Please try again later.",
  504: "The request timed out. Please try again.",
};

export function mapApiError(error: AxiosError<ApiErrorResponse>): MappedApiError {
  const statusCode = error.response?.status || 0;
  const responseData = error.response?.data;

  // Network error (no response at all)
  if (!error.response) {
    const isTimeout = error.code === "ECONNABORTED" || error.message.includes("timeout");
    return {
      message: isTimeout
        ? "Request timed out. Please check your connection and try again."
        : "Unable to connect. Please check your internet connection.",
      fieldErrors: [],
      statusCode: 0,
      isNetworkError: true,
      isTimeout,
      isServerError: false,
      isAuthError: false,
      isValidationError: false,
    };
  }

  // Extract field errors from 422 validation responses
  const fieldErrors: FieldError[] = responseData?.errors || [];

  // Use server message if available, otherwise use our map
  const message =
    responseData?.message ||
    HTTP_ERROR_MESSAGES[statusCode] ||
    `Unexpected error (${statusCode}). Please try again.`;

  return {
    message,
    fieldErrors,
    statusCode,
    errorCode: responseData?.errorCode,
    isNetworkError: false,
    isTimeout: false,
    isServerError: statusCode >= 500,
    isAuthError: statusCode === 401 || statusCode === 403,
    isValidationError: statusCode === 400 || statusCode === 422,
  };
}

/**
 * Extract a user-friendly string from any error.
 * Safe to call with unknown error types.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Check if it's an Axios error with our mapped response
    const axiosErr = error as AxiosError<ApiErrorResponse>;
    if (axiosErr.isAxiosError) {
      return mapApiError(axiosErr).message;
    }
    return error.message;
  }
  if (typeof error === "string") return error;
  return "An unexpected error occurred.";
}
