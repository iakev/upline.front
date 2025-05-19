import React from 'react';
import { OptimizedImage } from '../common/OptimizedImage'; // Assuming icon path is image-like
import { motion } from 'framer-motion';

interface Service {
  id: number;
  title: string;
  image: string;
  description: string;
}

interface ServiceCardProps {
  service: Service;
  onLearnMore: (service: Service) => void; // Callback when Learn More is clicked
  variants?: any; // For framer-motion entrance animation
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onLearnMore, variants }) => {
  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-md text-center h-full flex flex-col items-center group hover:shadow-xl transition-shadow duration-300"
      variants={variants} // Apply entrance animation variants
      whileHover={{ y: -5 }} // Slight lift on hover
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Icon/Image Container */}
      <div className="w-16 h-16 mb-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-transparent group-hover:border-blue-300 transition-colors duration-300">
        {/* Use OptimizedImage if icons are raster images, otherwise could use <img> or SVG component */}
        <OptimizedImage
          src={service.image}
          alt={`${service.title} icon`}
          className="w-full h-full object-cover"
          containerClassName="w-full h-full rounded-full"
          // Assuming small icons don't need placeholder/lazy load, but keeps component consistent
          // placeholderSrc="/icons/placeholder.svg"
        />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2 flex-grow">{service.title}</h3>
      <p className="text-gray-600 text-sm mb-4 flex-grow">{service.description}</p>
      <button
        onClick={() => onLearnMore(service)}
        className="mt-auto text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
      >
        Learn More &rarr;
      </button>
    </motion.div>
  );
};

export default ServiceCard;
