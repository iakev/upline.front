import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string | ReactNode;
  // Optional buttons override default 'Ok' button
  buttons?: {
    text: string;
    onClick: () => void;
    className?: string; // e.g., 'bg-red-600 hover:bg-red-700' for destructive actions
  }[];
}

export const AlertDialog: React.FC<AlertDialogProps> = ({ isOpen, onClose, title, message, buttons }) => {
  const defaultButtons = [
    {
      text: 'Ok',
      onClick: onClose,
      className: 'bg-primary hover:bg-primary-dark', // Use theme colors
    },
  ];

  const actionButtons = buttons || defaultButtons;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-60" />
        </Transition.Child>

        {/* Modal Content */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                  {title}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  {actionButtons.map((button, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-gray-800 ${button.className || 'bg-blue-500 hover:bg-blue-600'}`}
                      onClick={button.onClick}
                    >
                      {button.text}
                    </button>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
