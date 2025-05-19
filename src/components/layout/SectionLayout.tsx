import React, { ReactNode } from 'react';

interface SectionLayoutProps {
  children: ReactNode;
  id?: string; // Optional ID for linking/navigation
  className?: string; // Allow custom classes for background, etc.
  containerClassName?: string; // Allow custom classes for the inner container
  py?: string; // Vertical padding class (e.g., 'py-16', 'py-20')
}

/**
 * SectionLayout Component
 * Provides consistent structure and padding for main content sections.
 * Includes a standard container for content alignment.
 */
export const SectionLayout: React.FC<SectionLayoutProps> = ({
  children,
  id,
  className = 'bg-white dark:bg-gray-900', // Default background
  containerClassName = 'container mx-auto px-4 sm:px-6 lg:px-8', // Default container
  py = 'py-16 md:py-20', // Default vertical padding
}) => {
  return (
    <section id={id} className={`${py} ${className}`.trim()}>
      <div className={containerClassName}>{children}</div>
    </section>
  );
};

SectionLayout.displayName = 'SectionLayout';
