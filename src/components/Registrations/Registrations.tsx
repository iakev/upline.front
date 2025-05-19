import React from 'react';
import { OptimizedImage } from '../common/OptimizedImage'; // Import OptimizedImage
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

// Placeholder data for registrations/certifications
const registrationsData = [
  {
    id: 1,
    name: 'Certified Construction Inc.',
    logo: '/images/logos/cert-1.png', // Replace with actual logo paths
    link: '#', // Optional verification link
  },
  {
    id: 2,
    name: 'EcoBuild Certified',
    logo: '/images/logos/cert-2.png',
    link: '#',
  },
  {
    id: 3,
    name: 'Safety Standard Association',
    logo: '/images/logos/cert-3.png',
    link: '#',
  },
  {
    id: 4,
    name: 'Quality Builders Guild',
    logo: '/images/logos/cert-4.png',
    link: '#',
  },
  {
    id: 5,
    name: 'Infrastructure Excellence Award',
    logo: '/images/logos/cert-5.png',
    link: null, // No link example
  },
  {
    id: 6,
    name: 'Regional Contractors Board',
    logo: '/images/logos/cert-6.png',
    link: '#',
  },
];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 200, damping: 15 },
  },
};

const Registrations: React.FC = () => {
  const [ref, isVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.1, triggerOnce: true });

  // TODO: Integrate OptimizedImage for logos
  // TODO: Add animations

  return (
    <motion.section
      ref={ref}
      className="py-16 md:py-24 bg-white"
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Registrations & Certifications</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We adhere to the highest standards and are recognized by leading industry bodies.
          </p>
        </motion.div>

        {/* Logos Grid - Correctly use motion.div */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center"
          // Variants applied by the parent motion.section for stagger
        >
          {registrationsData.map((reg) => (
            // Wrap each logo container with motion.div and apply itemVariants
            <motion.div
              key={reg.id}
              className="text-center group"
              variants={itemVariants} // Apply item animation
            >
              {/* Use OptimizedImage for logos */}
              <div className="h-20 w-auto flex items-center justify-center mb-2 relative">
                <OptimizedImage
                  src={reg.logo}
                  alt={`${reg.name} logo`}
                  className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition duration-300"
                  placeholderSrc="/images/logos/placeholder.svg" // Optional placeholder
                  title={reg.name} // Add tooltip with the name
                />
              </div>
              {reg.link && (
                <a
                  href={reg.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline mt-1 inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-label={`Verify ${reg.name}`}
                >
                  Verify
                </a>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Registrations;
