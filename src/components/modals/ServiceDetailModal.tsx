import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { OptimizedImage } from '../common/OptimizedImage';

// Assuming the Service type is defined elsewhere and imported or redefined here
interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  icon?: JSX.Element;
  // Add any other relevant fields
}

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null; // The service data to display
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ isOpen, onClose, service }) => {
  if (!service) return null; // Don't render anything if no service is selected

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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all">
                {/* Close Button */}
                <button
                  type="button"
                  className="absolute top-4 right-4 z-10 p-1 rounded-full bg-white/50 dark:bg-black/50 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-black focus:outline-none"
                  onClick={onClose}
                  aria-label="Close service details"
                >
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Image */}
                <div className="relative aspect-[16/9]">
                  <OptimizedImage
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    // Add placeholder if available
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <Dialog.Title
                    as="h3"
                    className="text-xl md:text-2xl font-semibold leading-6 text-gray-900 dark:text-gray-100 mb-4"
                  >
                    {service.title}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-base text-gray-600 dark:text-gray-400 whitespace-pre-line">{service.description}</p>
                  </div>
                  {/* Add more details here if needed */}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
