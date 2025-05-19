import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { OptimizedImage } from '../common/OptimizedImage';

interface Service {
  id: number;
  title: string;
  image: string;
  description: string;
  details: string;
}

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ isOpen, onClose, service }) => {
  if (!service) return null; // Don't render if no service is selected

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
          <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity" />
        </Transition.Child>

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
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-2xl font-semibold leading-6 text-gray-900 mb-4 flex items-center">
                  <div className="w-10 h-10 mr-3 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <OptimizedImage src={service.image} alt={`${service.title} icon`} className="w-5 h-5 object-contain" />
                  </div>
                  {service.title}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {/* Display detailed description */}
                    {service.details || 'Details coming soon.'}
                  </p>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
                    onClick={onClose}
                  >
                    Close
                  </button>
                  {/* Optional: Add a CTA within the modal, e.g., "Request this Service" */}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ServiceDetailModal;
