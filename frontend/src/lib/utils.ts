import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ErrorResponse, HTTPValidationError } from "~/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(
  error: ErrorResponse | HTTPValidationError,
): string {
  if (typeof error.detail === "string") {
    return `An error occurred: ${error.detail}`; // Generic message if detail is a string
  }

  if (Array.isArray(error.detail)) {
    return "Validation failed. Please check your input."; // Generic message for validation errors
  }

  return "An unknown error occurred."; // Fallback for any other cases
}

export function calculateTimeForPosting(created_at: string): string {
  // Attempt to parse the date string
  const createdAtDate = new Date(created_at);

  // Check for invalid date parsing
  if (Number.isNaN(createdAtDate.getTime())) {
    throw new Error("Invalid date format");
  }

  const now = new Date();
  const elapsedMilliseconds = now.getTime() - createdAtDate.getTime();

  // Convert time differences in decreasing order of relevance
  const seconds = Math.floor(elapsedMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} d`;
  }
  if (hours > 0) {
    return `${hours} h`;
  }
  if (minutes > 0) {
    return `${minutes} m`;
  }
  return `${seconds} s`;
}
