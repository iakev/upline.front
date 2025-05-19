import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

// Define props if the component needs to receive handlers (e.g., for opening modal)
interface CTAProps {
  onOpenQuoteModal: () => void; // Expect the handler prop
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const CTA: React.FC<CTAProps> = ({ onOpenQuoteModal }) => {
  // Destructure the prop
  const [ref, isVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.4, triggerOnce: true });

  // TODO: Connect button onClick to openQuoteModal function (passed from App.tsx)
  // TODO: Add animations

  return (
    <motion.section
      ref={ref}
      className="py-16 md:py-24 bg-blue-600 text-white"
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
    >
      <div className="container mx-auto px-4 text-center">
        {/* Headline */}
        <motion.h2 className="text-3xl md:text-4xl font-bold mb-4" variants={itemVariants}>
          Ready to Start Your Next Project?
        </motion.h2>

        {/* Description */}
        <motion.p className="text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto" variants={itemVariants}>
          Let&apos;s build something great together. Contact us today for a free consultation and quote for your construction
          needs.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          onClick={onOpenQuoteModal} // Connect the onClick handler
          className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-100 shadow-md"
          aria-label="Get a free quote for your project"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Get a Free Quote
        </motion.button>
      </div>
    </motion.section>
  );
};

export default CTA;
