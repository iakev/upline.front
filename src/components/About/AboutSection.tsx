import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useScrollAnimation } from '../../hooks/useScrollAnimation'; // Use existing hook
import { OptimizedImage } from '../common/OptimizedImage'; // Use named import
import { useGetAboutsQuery } from '../../redux/api/aboutApi';

// Animation variants (optional)
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const AboutSection: React.FC = () => {
  // Use useScrollAnimation assuming it returns [ref, inView]
  const [sectionRef, sectionInView] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2, triggerOnce: true });

  // Fetch About data
  const {
    data: aboutsResponse,
    error,
    isLoading,
  } = useGetAboutsQuery({
    pageSize: 1,
    pageNumber: 1,
  });

  const aboutData = aboutsResponse?.aboutUs?.[0];
  const subheading = 'About Us';
  const heading = aboutData?.title ?? 'Building Tomorrow, Today';
  const content = aboutData?.content ?? 'Upline Developers creates lasting value...';
  // TODO: Confirm if API returns an image URL. The current About interface in aboutApi.ts lacks an 'image' field.
  // const imageUrl = aboutData?.image;
  const imageUrl = aboutData?.image || '/images/about-placeholder.jpg'; // Using placeholder for now

  // Stat data
  const stats = [
    { value: 4000, suffix: 'k+', label: 'Global customers' },
    { value: 60, suffix: '+', label: 'Experts' },
    { value: 10, suffix: '', label: 'Experience' },
    { value: 25, suffix: '', label: 'Awards' },
  ];

  return (
    <motion.div
      ref={sectionRef} // Assign ref
      variants={sectionVariants}
      initial="hidden"
      animate={sectionInView ? 'visible' : 'hidden'}
      className="container mx-auto px-4 py-16 md:py-24"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Left Column: Text and Stats */}
        <motion.div variants={itemVariants}>
          {isLoading ? (
            <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse mb-3"></div> // Subheading placeholder
          ) : (
            <p className="text-base font-semibold leading-7 text-[#F7BC1B] mb-3">{subheading}</p>
          )}
          {isLoading ? (
            <div className="h-10 w-3/4 bg-gray-300 rounded animate-pulse mb-4"></div> // Heading placeholder
          ) : (
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">{heading}</h2>
          )}
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : error ? (
            <p className="mt-6 text-lg leading-8 text-red-600">Error loading content.</p>
          ) : (
            <p className="mt-6 text-lg leading-8 text-gray-600">{content}</p>
          )}

          {/* Stats Grid */}
          <motion.dl
            className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 sm:gap-y-16"
            // variants={itemVariants} // Removed redundant variant application
          >
            {stats.map((stat, index) => (
              // Removed motion.div wrapper for individual stats for simplicity
              <div key={index} className="flex flex-col-reverse gap-y-2">
                <dt className="text-base leading-7 text-gray-600">{stat.label}</dt>
                <dd className="text-4xl font-bold leading-9 tracking-tight text-[#082E53] sm:text-5xl">
                  {/* Ensure CountUp only runs when in view */}
                  {sectionInView ? (
                    <CountUp end={stat.value} duration={2.5} suffix={stat.suffix} enableScrollSpy scrollSpyOnce />
                  ) : (
                    '0' + stat.suffix
                  )}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* Right Column: Image */}
        <motion.div variants={itemVariants} className="mt-10 md:mt-0">
          <OptimizedImage
            src={imageUrl}
            alt={heading || 'About Upline Developers'}
            className="w-full h-auto rounded-lg shadow-lg object-cover aspect-square md:aspect-auto"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AboutSection;
