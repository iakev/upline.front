import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation'; // Assuming hook exists
import { motion } from 'framer-motion'; // Import motion
import CountUp from 'react-countup'; // Import CountUp

// Placeholder data for statistics
const statsData = [
  { id: 1, value: 150, suffix: '+', label: 'Projects Completed' },
  { id: 2, value: 99, suffix: '%', label: 'Client Satisfaction' },
  { id: 3, value: 25, suffix: '+', label: 'Years of Experience' },
  { id: 4, value: 50, suffix: '+', label: 'Skilled Professionals' },
];

// Define animation variants (can be shared or component-specific)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1, // Small delay before children start
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const Statistics: React.FC = () => {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.5, triggerOnce: true });

  // TODO: Implement CountUp animation triggered by isVisible
  // TODO: Integrate framer-motion for reveal animation

  return (
    <motion.section
      ref={ref}
      className="py-16 md:py-24 bg-gray-100"
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
    >
      <div className="container mx-auto px-4">
        {/* Use motion.div for the grid if staggering children */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {statsData.map((stat) => (
            // Wrap each stat item in motion.div for individual animation
            <motion.div key={stat.id} className="p-4" variants={itemVariants}>
              {/* Use CountUp for animation, triggered by isVisible */}
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                {isVisible ? (
                  <CountUp end={stat.value} duration={2.5} suffix={stat.suffix} />
                ) : (
                  // Display initial value before animation
                  `0${stat.suffix || ''}`
                )}
              </div>
              <p className="text-lg text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Statistics;
