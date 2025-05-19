import React, { forwardRef, SelectHTMLAttributes } from 'react';

// Define the props for the Select component, extending standard HTML select attributes
// interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
//   // Add any custom props specific to your design system if needed later
// }

// Use the base type directly as SelectProps was empty
type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

/**
 * Basic Select Component
 * Renders a standard HTML select element.
 * Forwards refs to the underlying select element.
 * Styling is intended to be applied via Tailwind CSS classes passed in the className prop.
 * Children should be standard HTML <option> elements.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
  // Basic Tailwind styles for select fields
  const baseStyles =
    'block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500';
  // Disabled styles
  const disabledStyles = 'disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <select ref={ref} className={`${baseStyles} ${disabledStyles} ${className || ''}`.trim()} {...props}>
      {children}
    </select>
  );
});

// Set display name for React DevTools
Select.displayName = 'Select';
