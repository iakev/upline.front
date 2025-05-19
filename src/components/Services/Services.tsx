import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ServiceCard from './ServiceCard'; // Import the card component
import { ServiceDetailModal } from '../modals/ServiceDetailModal'; // Changed import path
import { useGetServicesQuery } from '../../redux/api/serviceApi'; // Import RTK Query hook
import Spinner from '../ui/Spinner'; // Import Spinner

// Define API Service Type (match API response)
interface ApiService {
  serviceId: number | string;
  title: string;
  description: string;
  image: string;
}

// Define a unified Service type for display components
// This should match the props for ServiceCard and ServiceDetailModal
interface DisplayService {
  id: number;
  title: string;
  image: string;
  description: string;
}

// --- Animation Variants ---
// const containerVariants = { // Removed
//   // ... variants ...
// };
const itemVariants = {
  // ... variants ...
};
// --- End Animation Variants ---

const Services: React.FC = () => {
  // const [ref, isVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.1, triggerOnce: true }); // Removed
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use state for the service data formatted for the modal/card
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<DisplayService | null>(null);

  // Fetch services using RTK Query
  const { data: servicesResponse, error, isLoading, isFetching } = useGetServicesQuery({});

  const formattedServices: DisplayService[] = (servicesResponse?.services || []).map((apiService: ApiService) => ({
    id: Number(apiService.serviceId) || 0,
    title: apiService.title,
    image: apiService.image,
    description: apiService.description,
  }));

  const handleLearnMore = (service: DisplayService) => {
    setSelectedServiceForModal(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // setTimeout(() => setSelectedServiceForModal(null), 300); // Optional delay
  };

  return (
    <section /*ref={ref}*/ className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Providing a wide range of construction services tailored to meet your needs.
          </p>
        </div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[200px]" // Add min-height
        >
          {isLoading || isFetching ? (
            <div className="col-span-full flex justify-center items-center">
              <Spinner size="h-10 w-10" />
            </div>
          ) : error ? (
            <div className="col-span-full text-center text-red-600">
              <p>Error loading services. Please try again later.</p>
            </div>
          ) : formattedServices.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              <p>No services currently available.</p>
            </div>
          ) : (
            formattedServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onLearnMore={handleLearnMore}
                variants={itemVariants} // Pass animation variants
              />
            ))
          )}
        </motion.div>
      </div>
      {/* Render the modal */}
      <ServiceDetailModal isOpen={isModalOpen} onClose={handleCloseModal} service={selectedServiceForModal} />
    </section>
  );
};

export default Services;
