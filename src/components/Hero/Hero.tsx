import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { OptimizedImage } from '../common/OptimizedImage';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useGetHerosQuery } from '../../redux/api/heroApi';
import Spinner from '../ui/Spinner';

// Define props interface
interface HeroProps {
  openQuoteModal: () => void;
}

const Hero: React.FC<HeroProps> = ({ openQuoteModal }) => {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();

  // Use the correct hook and variable names
  const {
    data: heroResponse,
    error: heroError,
    isLoading: isLoadingHero,
  } = useGetHerosQuery({
    pageNumber: 1,
    pageSize: 1,
  });

  // Use the correct data extraction path
  const heroData = heroResponse?.heros?.[0];
  const heroHeadline = heroData?.title ?? 'Building Your Vision...';
  const heroImageUrl = heroData?.image;

  // Log the fetched image URL when data is available
  React.useEffect(() => {
    if (heroImageUrl) {
      // console.log(`Hero.tsx: Fetched heroImageUrl = ${heroImageUrl}`); // Removed
    }
  }, [heroImageUrl]);

  // Define simple variants directly if needed, or skip animation for now
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      id="hero"
      ref={ref}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      className="relative flex items-center justify-center md:justify-start text-center md:text-left min-h-screen text-white bg-gray-800"
    >
      {/* Background Image Layer - Use updated variable */}
      {heroImageUrl ? (
        // Log the URL being passed
        (() => {
          // console.log(`Hero.tsx: Rendering OptimizedImage with src = ${heroImageUrl}`); // Removed
          return (
            <OptimizedImage
              src={heroImageUrl}
              alt={heroHeadline || 'Construction site background'}
              containerClassName="absolute inset-0 z-0"
              className=""
            />
          );
        })()
      ) : (
        // Optional: Placeholder if no image URL is found or while loading image
        <div className="absolute inset-0 w-full h-full bg-gray-700 z-0 flex items-center justify-center">
          {/* Use updated loading/error state variables */}
          {isLoadingHero ? <Spinner /> : <span className="text-gray-400">Loading Image...</span>}
        </div>
      )}
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/70 to-transparent z-10"></div>

      {/* Content Layer */}
      <div className="container mx-auto px-4 relative z-20 py-20 md:py-32 md:pl-16 lg:pl-24">
        <motion.div variants={containerVariants} className="max-w-2xl lg:max-w-3xl">
          {/* Headline - Use updated loading/error state variables */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight min-h-[50px]"
          >
            {isLoadingHero ? <Spinner size="h-8 w-8" /> : heroError ? 'Error loading content' : heroHeadline}
          </motion.h1>

          {/* Buttons - Use updated loading/error state variables */}
          {!isLoadingHero && !heroError && (
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button variant="primary" onClick={openQuoteModal}>
                Request a Quote
              </Button>
              <Button
                variant="secondary"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Our Services
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
