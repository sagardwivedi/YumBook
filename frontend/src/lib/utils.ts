import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ErrorResponse, HttpValidationError } from "~/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(
  error: ErrorResponse | HttpValidationError
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
  let elapsedMilliseconds = now.getTime() - createdAtDate.getTime();

  // Handle case where the time difference is negative but very small (e.g., just created post)
  if (elapsedMilliseconds < 0 && elapsedMilliseconds > -1000) {
    elapsedMilliseconds = 0; // Treat as 0 seconds if the difference is very small (less than 1 second)
  }

  // If the date is in the future, throw an error
  if (elapsedMilliseconds < 0) {
    throw new Error("The provided date is in the future");
  }

  // Convert time differences in decreasing order of relevance
  const seconds = Math.floor(elapsedMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Return a formatted string based on the largest unit of time
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
