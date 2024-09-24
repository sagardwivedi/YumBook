import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { ErrorResponse, HTTPValidationError } from '~/client';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(
  error: ErrorResponse | HTTPValidationError,
): string {
  if (typeof error.detail === 'string') {
    return `An error occurred: ${error.detail}`; // Generic message if detail is a string
  }

  if (Array.isArray(error.detail)) {
    return 'Validation failed. Please check your input.'; // Generic message for validation errors
  }

  return 'An unknown error occurred.'; // Fallback for any other cases
}
