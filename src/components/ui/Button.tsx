import React, { ButtonHTMLAttributes } from 'react';

// Define Button variants for styling
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  // Add other common button props like size, isLoading, etc. if needed
}

/**
 * Basic Button Component
 * Renders a standard HTML button element.
 * Supports different visual variants via the `variant` prop.
 * Styling is applied using Tailwind CSS.
 */
export const Button: React.FC<ButtonProps> = ({ className, children, variant = 'primary', type = 'button', ...props }) => {
  // Base styles common to all buttons
  const baseStyles =
    'inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors';

  // Variant-specific styles
  const getVariantStyles = (variant: ButtonVariant): string => {
    switch (variant) {
      case 'secondary':
        return 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 focus:ring-indigo-500 dark:bg-indigo-900 dark:text-indigo-100 dark:hover:bg-indigo-800';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
      case 'ghost':
        return 'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus:ring-indigo-500';
      case 'primary':
      default:
        return 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500';
    }
  };

  const variantStyles = getVariantStyles(variant);

  return (
    <button type={type} className={`${baseStyles} ${variantStyles} ${className || ''}`.trim()} {...props}>
      {children}
    </button>
  );
};

Button.displayName = 'Button';
