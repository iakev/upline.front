import React from 'react';
import { OptimizedImage } from '../common/OptimizedImage';
import { motion } from 'framer-motion';

interface InteractiveCardProps {
  imageSrc: string;
  placeholderSrc?: string;
  imageAlt: string;
  title: string;
  description?: string;
  linkHref?: string;
  category?: string;
  className?: string;
  variants?: any;
  children?: React.ReactNode;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({
  imageSrc,
  placeholderSrc,
  imageAlt,
  title,
  description,
  linkHref,
  category,
  className = '',
  variants,
  children,
}) => {
  const cardContent = (
    <motion.div
      className={`bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col group ${className}`}
      variants={variants}
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="relative w-full h-48 flex-shrink-0">
        <OptimizedImage
          src={imageSrc}
          placeholderSrc={placeholderSrc}
          alt={imageAlt}
          containerClassName="absolute inset-0"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {category && (
          <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
            {category}
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        {description && <p className="text-gray-600 text-sm flex-grow mb-4">{description}</p>}
        {children}
        {linkHref && (
          <a
            href={linkHref}
            className="mt-auto inline-block text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            Learn More &rarr;
          </a>
        )}
      </div>
    </motion.div>
  );

  return cardContent;
};

export default InteractiveCard;
