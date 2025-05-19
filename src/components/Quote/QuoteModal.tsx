import React from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { QuoteForm } from './QuoteForm';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * QuoteModal Component
 * Displays the quote request form within an accessible modal dialog using Headless UI.
 */
export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose }) => {
  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      {/* 
        The `Dialog` component automatically manages focus trapping and 
        provides necessary ARIA attributes. Closing can be handled via the `onClose` prop 
        (e.g., clicking backdrop, pressing Escape key).
      */}
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop / Overlay */}
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" aria-hidden="true" /> {/* Darker backdrop */}
        </TransitionChild>

        {/* Modal Container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* Modal Panel */}
            <TransitionChild
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 md:p-8 text-left align-middle shadow-xl transition-all">
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-4">
                  <DialogTitle as="h3" className="text-xl font-semibold leading-6 text-gray-900 dark:text-white">
                    Request a Project Quote
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    type="button" // Ensure it doesn't submit any form
                    className="inline-flex justify-center rounded-md border border-transparent p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    aria-label="Close quote request modal"
                  >
                    {/* Simple X icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Embed the Quote Form */}
                {/* Pass the onClose function to the form so it can trigger close on success */}
                <QuoteForm onSuccess={onClose} />
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

QuoteModal.displayName = 'QuoteModal';
