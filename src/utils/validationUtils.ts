import * as yup from 'yup';
import { MAX_FILE_SIZE, validFileExt, FileTypeCategory } from './validationConstants';

/**
 * Checks if the file extension is valid for the given category.
 * @param fileName - The full name of the file (e.g., 'image.png').
 * @param fileType - The category to check against (e.g., 'image').
 * @returns True if the file type is valid or if fileName is null/undefined, false otherwise.
 */
export const isValidFileType = (fileName: string | undefined | null, fileType: FileTypeCategory): boolean => {
  if (!fileName) {
    return true; // Allow empty/undefined file names (validation handled by required schema)
  }
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (!extension) {
    return false; // File has no extension
  }
  return validFileExt[fileType].includes(extension);
};

/**
 * Checks if the file size is within the allowed limit.
 * @param file - The File object.
 * @returns True if the file size is valid or if file is null/undefined, false otherwise.
 */
export const isValidSize = (file: File | undefined | null): boolean => {
  if (!file) {
    return true; // Allow empty/undefined files
  }
  return file.size <= MAX_FILE_SIZE;
};

// Interface for the expected structure of Yup validation errors when abortEarly is false
interface YupValidationError {
  inner: { path: string; message: string }[];
}

/**
 * Creates a validation function compatible with useGenericForm's `validateAtInput`.
 * @param schema - The Yup schema to use for validation.
 * @returns An async function that validates a single field.
 */
export const createYupValidatorAtInput = <T extends yup.ObjectSchema<any>>(
  schema: T,
): ((name: string, value: any) => Promise<string | null>) => {
  return async (name, value) => {
    try {
      await schema.validateAt(name, { [name]: value });
      return null; // No error
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return error.message; // Return the Yup error message
      }
      // Handle other potential errors
      if (error instanceof Error) {
        return error.message; // Return message if it's a standard Error
      }
      return 'An unexpected error occurred during validation.'; // Generic error
    }
  };
};

/**
 * Creates a validation function compatible with useGenericForm's `validateInputs`.
 * Handles both full form validation and single file validation.
 * @param schema - The Yup schema to use for validation.
 * @returns An async function that validates the entire form or a single file.
 */
export const createYupValidateInputs = <T extends yup.ObjectSchema<any>>(
  schema: T,
): ((inputsOrName: Record<string, any> | string, file?: File) => Promise<Record<string, string | null> | string | null>) => {
  return async (inputsOrName, file) => {
    try {
      if (typeof inputsOrName === 'string' && file) {
        // Single file validation mode
        const name = inputsOrName;
        await schema.validateAt(name, { [name]: file });
        return null; // No error for this file field
      } else if (typeof inputsOrName === 'object') {
        // Full form validation mode
        await schema.validate(inputsOrName, { abortEarly: false });
        return null; // No errors found
      } else {
        // Should not happen based on useGenericForm usage
        throw new Error('Invalid arguments for validateInputs');
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        // Check if it's a single file validation error or full form
        if (typeof inputsOrName === 'string') {
          return error.message; // Return single error message for file
        }
        // Format errors from full form validation into { field: message } object
        const formattedErrors: Record<string, string | null> = {};
        (error as YupValidationError).inner.forEach((err) => {
          if (err.path) {
            formattedErrors[err.path] = err.message;
          }
        });
        return formattedErrors;
      }
      // Handle other potential errors
      if (error instanceof Error) {
        return error.message;
      }
      return 'An unexpected error occurred during validation.'; // Generic error string for full form
    }
  };
};
