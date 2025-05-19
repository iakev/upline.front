import React, { useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useGenericForm from '../../hooks/useGenericForm';
import { FormFields, LayoutConfig } from '../ui/FormFields';
import { AppDispatch, RootState } from '../../redux/store';
import { setErrorDialog, editInputs, resetInputs } from '../../redux/slices/contactFormSlice';
import GoogleMap from './GoogleMap';
import Spinner from '../ui/Spinner';
import { useAddContactFormMutation } from '../../redux/api/contactFormApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import FormFeedback from '../ui/FormFeedback';
import { contactFormSchema } from '../../validation/schemas/contactForm.schema';
import { createYupValidatorAtInput, createYupValidateInputs } from '../../utils/validationUtils';
import { contactFormOptions as configFormOptions } from '../../featureConfig/contactFormConfig';
import logger from '../../utils/logger';

interface ContactFormSubmission {
  name: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Select only initial values from Redux config
  const initialFormValues = useSelector((state: RootState) => state.contactForm.config.contactFormInputs);
  // Errors will now come from the hook
  // const errors = useSelector((state: RootState) => state.contactForm.error);

  const [addContactForm, { isLoading: isSubmitting, isSuccess, isError, error: submissionError }] =
    useAddContactFormMutation();

  // Memoized Validation Functions
  const memoizedValidateAtInput = useMemo(() => createYupValidatorAtInput(contactFormSchema), []);
  const memoizedValidateInputs = useMemo(() => createYupValidateInputs(contactFormSchema), []);

  // Need to define resetForm *before* using it in handleContactSubmit's dependency array
  // Temporarily declare it, will be properly assigned by the hook
  let resetForm = () => {};

  // Submission Logic (Reset is handled by hook now, dispatch not needed here)
  const handleContactSubmit = useCallback(
    async (submittedInputs: ContactFormSubmission) => {
      // console.log('Submitting Contact Form:', submittedInputs); // Removed
      try {
        await addContactForm({
          name: submittedInputs.name,
          email: submittedInputs.email,
          message: submittedInputs.message,
        }).unwrap();
        resetForm(); // Call the hook's reset function
      } catch (_err) {
        // console.error('Failed to submit contact form:', err); // Removed
        logger.error('Failed to submit contact form:', _err);
      }
      // Dependencies: addContactForm and the actual resetForm from the hook
    },
    [addContactForm, resetForm],
  ); // Add resetForm here

  // Form Hook Initialization (Updated for Hybrid)
  // Get inputs, errors back from the hook
  const {
    inputs,
    errors,
    handleInputChange,
    handleSubmit,
    resetForm: actualResetForm,
  } = useGenericForm<ContactFormSubmission>({
    initialValues: initialFormValues, // Pass initial config values from selector
    // inputs: inputs, // Removed - Hook manages locally
    // errors: errors, // Removed - Hook manages locally
    validateAtInput: memoizedValidateAtInput,
    validateInputs: memoizedValidateInputs,
    onSubmit: handleContactSubmit,
    dispatch,
    editInputAction: editInputs, // Pass action creator (for Redux error state)
    setErrorDialog: setErrorDialog, // Pass action creator
    resetInputsAction: resetInputs, // Pass action creator (for Redux error state)
  });

  // Assign the actual resetForm function from the hook to the variable used in the callback
  resetForm = actualResetForm;

  // Memoized FormFields Configuration
  const memoizedContactFormOptions = useMemo(() => configFormOptions, []);
  const memoizedContactLayoutConfig: LayoutConfig = useMemo(
    () => ({
      legend: 'Contact Form',
    }),
    [],
  );

  // Helper function to extract error message (Refined)
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

  // Derived state for UI feedback based on mutation status
  const submitStatusMessage = isSuccess
    ? 'Message sent successfully!'
    : isError
      ? `Error sending message: ${getErrorMessage(submissionError)}`
      : null;
  const submitStatusType = isSuccess ? 'success' : isError ? 'error' : 'idle';

  return (
    <section id="contact" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions or ready to start a project? Get in touch with us!
          </p>
        </div>

        {/* Grid for Form and Map/Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Contact Form Column */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Send Us a Message</h3>
            <FormFeedback type={submitStatusType === 'idle' ? 'success' : submitStatusType} message={submitStatusMessage} />

            <form onSubmit={handleSubmit} noValidate>
              <FormFields
                options={memoizedContactFormOptions}
                inputs={inputs}
                errors={errors}
                handleInputChange={handleInputChange}
                layout={memoizedContactLayoutConfig}
              />
              <button
                type="submit"
                disabled={isSubmitting || Object.values(errors).some((err) => err !== null)}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Spinner size="h-5 w-5" /> : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Map and Info Column */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Our Location & Info</h3>
            {/* Google Map Placeholder */}
            <div className="mb-8">
              <GoogleMap />
            </div>

            {/* Contact Details */}
            <div className="space-y-4 text-gray-700">
              <p className="flex items-start">
                <span className="mt-1 mr-3 text-blue-600">{/* Placeholder for Location Icon */}📍</span>
                <span>
                  123 Construction Ave,
                  <br />
                  Building Suite 456,
                  <br />
                  Anytown, ST 98765
                </span>
              </p>
              <p className="flex items-center">
                <span className="mr-3 text-blue-600">{/* Placeholder for Phone Icon */}📞</span>
                <span>(123) 456-7890</span>
              </p>
              <p className="flex items-center">
                <span className="mr-3 text-blue-600">{/* Placeholder for Email Icon */}✉️</span>
                <a href="mailto:info@constructco.com" className="hover:text-blue-600">
                  info@constructco.com
                </a>
              </p>
              <p className="flex items-center">
                <span className="mr-3 text-blue-600">{/* Placeholder for Hours Icon */}⏰</span>
                <span>Mon - Fri: 8:00 AM - 5:00 PM</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
