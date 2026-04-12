/**
 * Theme Framework Error Classes
 *
 * Custom error classes for the theme framework providing detailed
 * error information for validation failures.
 *
 * @module themes/errors
 * @see Requirements: 2.1, 15.1-15.3
 */

import type { ThemeValidationError as ThemeValidationErrorDetail } from "../types/theme";

/**
 * Error thrown when theme validation fails.
 *
 * Provides field-level details about what validation rules were violated.
 * Used by ThemeRegistry when registering invalid themes.
 *
 * @example
 * ```typescript
 * throw new ThemeValidationError("Invalid theme", [
 *   { field: "accent", message: "Invalid color value", value: "not-a-color" }
 * ]);
 * ```
 *
 * @see Requirements: 2.1, 15.1
 */
export class ThemeValidationError extends Error {
  /**
   * Array of field-level validation errors.
   */
  public readonly errors: ThemeValidationErrorDetail[];

  /**
   * The name of the theme that failed validation (if available).
   */
  public readonly themeName?: string;

  constructor(
    message: string,
    errors: ThemeValidationErrorDetail[] = [],
    themeName?: string
  ) {
    super(message);
    this.name = "ThemeValidationError";
    this.errors = errors;
    this.themeName = themeName;

    // Maintains proper stack trace for where error was thrown (V8 engines)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ThemeValidationError);
    }
  }

  /**
   * Returns a formatted string with all validation errors.
   */
  getDetailedMessage(): string {
    if (this.errors.length === 0) {
      return this.message;
    }

    const errorDetails = this.errors
      .map((e) => `  - ${e.field}: ${e.message}${e.value !== undefined ? ` (got: ${JSON.stringify(e.value)})` : ""}`)
      .join("\n");

    return `${this.message}\n${errorDetails}`;
  }

  /**
   * Returns the fields that failed validation.
   */
  getInvalidFields(): string[] {
    return this.errors.map((e) => e.field);
  }
}

/**
 * Error thrown when BrandKit validation fails.
 *
 * Provides details about which BrandKit fields contain invalid values.
 *
 * @see Requirements: 13.2, 15.3
 */
export class BrandKitValidationError extends Error {
  /**
   * Array of field names that failed validation.
   */
  public readonly invalidFields: string[];

  constructor(message: string, invalidFields: string[] = []) {
    super(message);
    this.name = "BrandKitValidationError";
    this.invalidFields = invalidFields;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BrandKitValidationError);
    }
  }

  /**
   * Returns a formatted string with all invalid fields.
   */
  getDetailedMessage(): string {
    if (this.invalidFields.length === 0) {
      return this.message;
    }

    return `${this.message}: ${this.invalidFields.join(", ")}`;
  }
}

/**
 * Error thrown when template validation fails.
 *
 * Provides details about which template configuration fields are invalid.
 *
 * @see Requirements: 15.2
 */
export class TemplateValidationError extends Error {
  /**
   * Array of validation error details.
   */
  public readonly errors: Array<{ field: string; message: string; value?: unknown }>;

  /**
   * The template ID that failed validation (if available).
   */
  public readonly templateId?: string;

  constructor(
    message: string,
    errors: Array<{ field: string; message: string; value?: unknown }> = [],
    templateId?: string
  ) {
    super(message);
    this.name = "TemplateValidationError";
    this.errors = errors;
    this.templateId = templateId;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TemplateValidationError);
    }
  }

  /**
   * Returns a formatted string with all validation errors.
   */
  getDetailedMessage(): string {
    if (this.errors.length === 0) {
      return this.message;
    }

    const errorDetails = this.errors
      .map((e) => `  - ${e.field}: ${e.message}${e.value !== undefined ? ` (got: ${JSON.stringify(e.value)})` : ""}`)
      .join("\n");

    return `${this.message}\n${errorDetails}`;
  }
}
