import { useState, useEffect, useRef, useMemo, useCallback, ChangeEvent, FormEvent } from 'react';
import { Action, Dispatch } from 'redux'; // Assuming standard Redux types

// Define interfaces for better type safety
export interface InitialValues {
  // Exported for use as constraint
  [key: string]: any;
}

interface Errors {
  [key: string]: string | null;
}

interface ValidateFunction {
  (name: string, value: any): Promise<string | null> | string | null;
}

// Define possible return types for the validation function used on submit
type ValidationResult = string | null | Errors;

// Allow validateInputs to accept single field check OR all inputs,
// and allow it to return null, a single error string, or an object of errors
interface ValidateAllFunction<TFormValues extends InitialValues> {
  (inputsOrName: TFormValues | string, file?: File): Promise<ValidationResult> | ValidationResult;
}

interface SubmitFunction<TFormValues extends InitialValues> {
  (inputs: TFormValues, formData?: FormData | null): void;
}

// Assuming these Redux action creators exist and have appropriate types
// Define more specific types based on your actual Redux setup if possible
interface EditInputActionPayload {
  name: string;
  value: any;
  error: string | null;
  inputType?: string; // Keep optional
}
interface EditInputAction extends Action {
  payload: EditInputActionPayload;
}

interface SetErrorDialogActionPayload {
  alert: { show: boolean; message: string; title: string };
}
interface SetErrorDialogAction extends Action {
  payload: SetErrorDialogActionPayload;
}

// Define ResetInputAction type (assuming no payload needed)
type ResetInputAction = Action; // Use type alias as it adds no new members

export interface UseGenericFormArgs<TFormValues extends InitialValues> {
  initialValues: TFormValues; // Source for initial local state
  validateAtInput: ValidateFunction;
  validateInputs: ValidateAllFunction<TFormValues>;
  onSubmit: SubmitFunction<TFormValues>;
  dispatch: Dispatch<any>;
  editInputAction: (payload: EditInputActionPayload) => EditInputAction;
  setErrorDialog: (payload: SetErrorDialogActionPayload) => SetErrorDialogAction;
  resetInputsAction: () => ResetInputAction; // For resetting Redux error state
  inputType?: string | null;
}

export interface UseGenericFormReturn<TFormValues extends InitialValues> {
  inputs: TFormValues;
  errors: Errors;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => Promise<void>;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  resetForm: () => void;
}

/**
 * Custom hook for handling generic form logic including local state management,
 * validation, file handling, and submission.
 *
 * Integrates selectively with Redux: Initializes from props, dispatches actions for errors/reset.
 */
function useGenericForm<TFormValues extends InitialValues>({
  initialValues,
  validateAtInput,
  validateInputs,
  onSubmit,
  dispatch,
  editInputAction,
  setErrorDialog,
  resetInputsAction,
  inputType = null,
}: UseGenericFormArgs<TFormValues>): UseGenericFormReturn<TFormValues> {
  // Sanitize initial values for initial state
  const sanitizedInitialValues = useMemo(() => {
    const base = initialValues || ({} as TFormValues); // Ensure base is TFormValues
    return Object.keys(base).reduce<TFormValues>(
      (acc, key) => {
        // We need to be careful with indexing generics.
        // Assuming TFormValues allows string indexing from its InitialValues constraint.
        (acc as any)[key] = (base as any)[key] === undefined ? '' : (base as any)[key];
        return acc;
      },
      { ...initialValues } as TFormValues, // Start with a spread of initialValues, cast to TFormValues
    );
  }, [initialValues]);

  // --- Reintroduce local state management ---
  const [inputs, setInputs] = useState<TFormValues>(sanitizedInitialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [formData, setFormData] = useState<FormData | null>(null); // Keep local state for FormData
  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // --- Effect to reset local state if initialValues prop changes ---
  useEffect(() => {
    setInputs(sanitizedInitialValues);
    setErrors({}); // Also clear local errors on reset
    setFormData(null); // Clear form data
    // Optionally dispatch resetInputsAction here too if Redux errors should clear on external initialValue change
    // dispatch(resetInputsAction());
  }, [sanitizedInitialValues]); // Re-run if the initialValues prop reference changes

  // --- Input change handler: Update local state, dispatch for Redux error update ---
  const handleInputChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const target = e.target as HTMLInputElement;
      const { name, value, type, files } = target;
      const checked = target.checked;

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      if (type === 'file' && files?.length) {
        const file = files[0];
        const error = (await validateInputs(name, file)) as string | null;
        // Update local error state
        setErrors((currentErrors) => ({ ...currentErrors, [name]: error }));
        // Dispatch action to update Redux error state
        dispatch(editInputAction({ name, value: null, error }));

        if (error) {
          setFormData(null);
        } else {
          const newFormData = new FormData();
          newFormData.append(name, file);
          setFormData(newFormData);
          // Clear local error for this field if valid
          setErrors((currentErrors) => ({ ...currentErrors, [name]: null }));
          // Also clear Redux error
          dispatch(editInputAction({ name, value: file, error: null }));
        }
      } else {
        const newValue = type === 'checkbox' ? checked : value;
        // Update local input state FIRST
        setInputs((currentInputs) => ({ ...currentInputs, [name]: newValue }));

        // Debounced validation and Redux error dispatch
        debounceTimeout.current = setTimeout(async () => {
          const error = await validateAtInput(name, newValue);
          // Update local error state
          setErrors((currentErrors) => ({ ...currentErrors, [name]: error }));
          // Dispatch action to update Redux error state
          const payload: EditInputActionPayload = { name, value: newValue, error };
          if (inputType) {
            payload.inputType = inputType;
          }
          dispatch(editInputAction(payload));
        }, 500);
      }
    },
    [validateInputs, validateAtInput, dispatch, editInputAction, inputType],
  );

  // --- Form reset handler: Reset local state, dispatch for Redux error reset ---
  const resetForm = useCallback(() => {
    // Reset local state
    setInputs(sanitizedInitialValues);
    setErrors({});
    setFormData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Dispatch action to clear Redux error state
    dispatch(resetInputsAction());
  }, [sanitizedInitialValues, dispatch, resetInputsAction]);

  // --- Form submission handler: Use local state ---
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // Clear only local error state before validation
      setErrors({});
      // Dispatch action to clear Redux error state before validation
      dispatch(resetInputsAction());

      // Validate using the hook's local 'inputs' state
      const validationResult: ValidationResult = await validateInputs(inputs);

      if (validationResult) {
        if (typeof validationResult === 'string') {
          // Set local error state for general form error
          setErrors({ form: validationResult });
          // Dispatch global dialog
          dispatch(
            setErrorDialog({
              alert: { show: true, message: `Please correct the errors: ${validationResult}`, title: 'Submission Error' },
            }),
          );
          // Also dispatch to potentially update Redux error state if needed
          // dispatch(editInputAction({ name: 'form', value: null, error: validationResult }));
        } else {
          // Set local error state with field-specific errors
          setErrors(validationResult as Errors);
          // Dispatch global dialog
          dispatch(
            setErrorDialog({
              alert: { show: true, message: `Please correct the indicated errors.`, title: 'Submission Error' },
            }),
          );
          // Dispatch errors to Redux state
          Object.entries(validationResult).forEach(([name, error]) => {
            dispatch(editInputAction({ name, value: inputs[name], error }));
          });
        }
        return;
      }

      const filteredInputs = Object.fromEntries(
        Object.entries(inputs).filter(([_, value]) => value !== undefined && value !== ''),
      ) as TFormValues; // Cast to TFormValues

      onSubmit(filteredInputs, formData);
    },
    [
      validateInputs,
      inputs,
      dispatch,
      setErrorDialog,
      onSubmit,
      formData,
      editInputAction,
      resetInputsAction,
      sanitizedInitialValues,
    ],
  ); // Added resetInputsAction, sanitizedInitialValues

  // --- Return local state and handlers ---
  return {
    inputs, // Return local state
    errors, // Return local state
    handleInputChange,
    handleSubmit,
    fileInputRef,
    resetForm,
  };
}

export default useGenericForm;
