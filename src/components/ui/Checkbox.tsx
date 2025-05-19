import React, { forwardRef, InputHTMLAttributes } from 'react';

// Define the props for the Checkbox component, extending standard HTML input attributes
// interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
//   // Omit 'type' as it's fixed to 'checkbox'
//   // Add any custom props specific to your design system if needed later
// }

// Use the base type directly as CheckboxProps was empty
type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

/**
 * Basic Checkbox Component
 * Renders a standard HTML input element with type="checkbox".
 * Forwards refs to the underlying input element.
 * Styling is intended to be applied via Tailwind CSS classes passed in the className prop.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ className, ...props }, ref) => {
  // Basic Tailwind styles for checkboxes
  const baseStyles =
    'h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-offset-gray-800';
  // Disabled styles
  const disabledStyles = 'disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <input ref={ref} type="checkbox" className={`${baseStyles} ${disabledStyles} ${className || ''}`.trim()} {...props} />
  );
});

// Set display name for React DevTools
Checkbox.displayName = 'Checkbox';
