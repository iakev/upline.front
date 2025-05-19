import React, { useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector
import useGenericForm from '../../hooks/useGenericForm';
import { FormFields, OptionConfig, LayoutConfig } from '../ui/FormFields';
import { Button } from '../ui/Button';
import { Text } from '../ui/Text';
import { useAddQuoteMutation } from '../../redux/api/quoteApi';
import Spinner from '../ui/Spinner';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
// Import action creators from the specific quote slice
import { setErrorDialog, editInputs, resetInputs } from '../../redux/slices/quoteFormSlice';
import { AppDispatch, RootState } from '../../redux/store'; // Import RootState
// Action type is not needed here anymore
// import { Action } from 'redux';

// Placeholder edit action creator is no longer needed
// interface EditInputAction extends Action {
//   payload: { name: string; value: any; error: string | null; inputType?: string };
// }
// const someEditAction = (name: string, value: any, error: string | null, inputType?: string): EditInputAction => ({
//     type: 'FORM_EDIT', // Placeholder type
//     payload: { name, value, error, inputType }
// });

interface QuoteFormInputState {
  name: string;
  email: string;
  phone: string;
  service: string;
  description: string;
  budget?: string; // Optional as per form config
  file?: File | null; // File input value
}

interface QuoteFormProps {
  onSuccess: () => void;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({ onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Select only initial values from Redux config (or defaults if no config)
  // Assuming quoteForm slice config holds the structure
  const initialQuoteValues = useSelector((state: RootState) => state.quoteForm.config.quoteInputs);
  // Errors will come from the hook
  // const errors = useSelector((state: RootState) => state.quoteForm.error);

  const [addQuote, { isLoading: isSubmitting, isSuccess: _isSuccess, isError: _isError, error: _submissionError }] =
    useAddQuoteMutation();

  // FormFields Configuration (Memoized)
  const quoteFormOptions: OptionConfig[] = useMemo(
    () => [
      { key: 'name', name: 'name', label: 'Full Name', type: 'text', editable: true, visible: true },
      { key: 'email', name: 'email', label: 'Email Address', type: 'email', editable: true, visible: true },
      { key: 'phone', name: 'phone', label: 'Phone Number', type: 'tel', editable: true, visible: true },
      {
        key: 'service',
        name: 'service',
        label: 'Service Interested In',
        type: 'select',
        editable: true,
        visible: true,
        items: [
          { id: 'general', name: 'General Construction' },
          { id: 'remodeling', name: 'Home Remodeling' },
          { id: 'commercial', name: 'Commercial Projects' },
          { id: 'design', name: 'Design & Build' },
          { id: 'other', name: 'Other (Describe Below)' },
        ],
      },
      {
        key: 'description',
        name: 'description',
        label: 'Project Description',
        type: 'textarea',
        editable: true,
        visible: true,
      },
      {
        key: 'budget',
        name: 'budget',
        label: 'Estimated Budget (Optional)',
        type: 'select',
        editable: true,
        visible: true,
        items: [
          { id: '', name: 'Select Budget Range' },
          { id: '<10k', name: 'Under $10,000' },
          { id: '10k-50k', name: '$10,000 - $50,000' },
          { id: '50k-100k', name: '$50,000 - $100,000' },
          { id: '>100k', name: 'Over $100,000' },
          { id: 'uncertain', name: 'Uncertain / Needs Discussion' },
        ],
      },
      { key: 'file', name: 'file', label: 'Upload Plans/Drawings (Optional)', type: 'file', editable: true, visible: true },
    ],
    [],
  );

  const quoteLayoutConfig: LayoutConfig = useMemo(
    () => ({
      legend: 'Project Details',
      gridClass: 'grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2',
    }),
    [],
  );

  const labelLookup: { [key: string]: string } = useMemo(
    () =>
      quoteFormOptions.reduce(
        (acc, opt) => {
          acc[opt.name] = opt.label;
          return acc;
        },
        {} as { [key: string]: string },
      ),
    [quoteFormOptions],
  );

  // Validation Logic
  const validateQuoteField = useCallback(
    async (name: string, value: unknown): Promise<string | null> => {
      if (name !== 'budget' && name !== 'file' && !value) return `${labelLookup[name] || name} is required.`;
      if (name === 'email' && value && typeof value === 'string' && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
        return 'Invalid email format.';
      if (
        name === 'phone' &&
        value &&
        typeof value === 'string' &&
        !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(value)
      )
        return 'Invalid phone number format.';
      return null;
    },
    [labelLookup],
  );

  const validateAllQuoteFields = useCallback(
    async (inputsOrName: Record<string, any> | string, _file?: File): Promise<string | null | Record<string, string>> => {
      // If called for a single file (inputsOrName is string), delegate or return null
      // This part might need more sophisticated handling based on how useGenericForm uses it for files
      if (typeof inputsOrName === 'string') {
        // Assuming individual file validation is handled by validateQuoteField (validateAtInput)
        // or that useGenericForm expects this path to do something specific for files if validateAtInput doesn't cover it.
        // For now, to satisfy the type and avoid breaking submission, we'll return null for the string case.
        // If file validation needs to happen here, logic would be added.
        return null;
      }

      // Existing logic for validating all fields (inputsOrName is Record<string, any>)
      const currentInputs = inputsOrName;
      const errors: Record<string, string> = {};
      for (const key in currentInputs) {
        if (key !== 'budget' && key !== 'file' && !currentInputs[key]) {
          errors[key] = `${labelLookup[key] || key} is required.`;
        }
        if (
          key === 'email' &&
          currentInputs[key] &&
          typeof currentInputs[key] === 'string' &&
          !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(currentInputs[key] as string)
        ) {
          errors[key] = 'Invalid email format.';
        }
      }
      return Object.keys(errors).length > 0 ? errors : null;
    },
    [labelLookup],
  );

  // Need to define resetForm before using it in handleQuoteSubmit dependency array
  let resetForm = () => {};

  // Submission Logic
  const handleQuoteSubmit = useCallback(
    async (submittedInputs: QuoteFormInputState, formData?: FormData | null) => {
      // console.log('Submitting Quote Request:', submittedInputs); // Removed
      const dataToSend = formData || new FormData();
      // ... (append logic)
      if (!formData) {
        Object.keys(submittedInputs).forEach((key) => {
          if (key !== 'file') {
            dataToSend.append(key, submittedInputs[key as keyof QuoteFormInputState] as string);
          }
        });
      } else {
        Object.keys(submittedInputs).forEach((key) => {
          if (key !== 'file' && !dataToSend.has(key)) {
            dataToSend.append(key, submittedInputs[key as keyof QuoteFormInputState] as string);
          }
        });
      }

      try {
        await addQuote(dataToSend).unwrap();
        onSuccess();
        resetForm(); // Call hook's reset
      } catch (err) {
        // console.error('Quote submission failed:', err); // Removed
        const errorMessage = getErrorMessage(err as FetchBaseQueryError | SerializedError);
        dispatch(
          setErrorDialog({
            alert: { show: true, message: `Failed to submit quote request: ${errorMessage}.`, title: 'Submission Error' },
          }),
        );
      }
    },
    [addQuote, onSuccess, dispatch, resetForm],
  ); // Added resetForm dependency

  // Form Hook Initialization (Updated for Hybrid)
  const {
    inputs,
    errors,
    handleInputChange,
    handleSubmit,
    fileInputRef,
    resetForm: actualResetForm,
  } = useGenericForm<QuoteFormInputState>({
    initialValues: initialQuoteValues as QuoteFormInputState, // Pass initial values from selector, cast
    validateAtInput: validateQuoteField,
    validateInputs: validateAllQuoteFields,
    onSubmit: handleQuoteSubmit,
    dispatch: dispatch,
    editInputAction: editInputs, // Pass action creator (for Redux error state)
    setErrorDialog: setErrorDialog, // Pass action creator
    resetInputsAction: resetInputs, // Pass action creator (for Redux error state)
  });

  // Assign the actual resetForm from the hook
  resetForm = actualResetForm;

  // Helper function to extract error message
  const getErrorMessage = (error: FetchBaseQueryError | SerializedError | undefined): string => {
    if (!error) return 'Unknown error';
    if ('status' in error) {
      const fetchError = error as FetchBaseQueryError;
      let message = 'Server error';
      if (typeof fetchError.data === 'object' && fetchError.data !== null && 'message' in fetchError.data) {
        message = String(fetchError.data.message);
      } else if (typeof fetchError.data === 'string' && fetchError.data.trim() !== '') {
        message = fetchError.data;
      }
      return `Error ${fetchError.status}: ${message}`;
    } else {
      const serializedError = error as SerializedError;
      return serializedError.message || 'An unknown error occurred';
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Use errors state from hook */}
      {errors.form && <Text className="text-red-600 mb-4 text-center">{errors.form}</Text>}
      <FormFields
        ref={fileInputRef}
        inputs={inputs} // Pass inputs state from hook
        handleInputChange={handleInputChange}
        options={quoteFormOptions}
        layout={quoteLayoutConfig}
        errors={errors} // Pass errors state from hook
      />
      <div className="mt-6 flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onSuccess} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          // Use errors state from hook for disabled logic
          disabled={isSubmitting || Object.values(errors).some((err) => err !== null)}
          className="flex items-center justify-center"
        >
          {isSubmitting ? <Spinner size="h-5 w-5 mr-2" /> : null}
          {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
        </Button>
      </div>
    </form>
  );
};

QuoteForm.displayName = 'QuoteForm';
