import React, { useState, useMemo } from 'react';
import InteractiveCard from '../ui/InteractiveCard';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setActiveCategoryFilter } from '../../redux/slices/projectSlice';
import { useGetProjectsQuery } from '../../redux/api/projectApi';
import Spinner from '../ui/Spinner';

// --- Project Type (align with API response) ---
interface Project {
  projectId: number | string;
  title: string;
  location?: string; // Mark optional if not always present
  image: string;
  category: string;
  description?: string;
  // Add other potential fields if needed
}

const projectCategories = ['All', 'Commercial', 'Residential', 'Industrial'];

// Define sorting options
const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'title-asc', label: 'Title (A-Z)' },
  { value: 'title-desc', label: 'Title (Z-A)' },
  // Add more sorting options if needed (e.g., by date if available)
];

// Animation Variants (similar to Statistics)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
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

const Projects: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeCategoryFilter = useAppSelector((state) => state.projects.activeCategoryFilter);
  const [ref, isVisible] = useScrollAnimation<HTMLElement>({ threshold: 0.1, triggerOnce: true });
  const [sortBy, setSortBy] = useState<string>(sortOptions[0].value); // Default sort state

  // Use RTK Query to fetch projects, passing the category filter
  const queryArgs = {
    category: activeCategoryFilter === 'All' ? undefined : activeCategoryFilter,
    // Add other args like pagination if needed
    // pageSize: 6,
    // pageNumber: 1,
  };
  const { data: projectsResponse, error, isLoading, isFetching } = useGetProjectsQuery(queryArgs);

  const projects = projectsResponse?.projects ?? []; // Default to empty array

  // --- Filtering (handled by query) & Sorting ---
  const sortedProjects = useMemo(() => {
    const sortableProjects = [...projects]; // Create a mutable copy
    switch (sortBy) {
      case 'title-asc':
        sortableProjects.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        sortableProjects.sort((a, b) => b.title.localeCompare(a.title));
        break;
      // Add cases for other sort options
      default: // 'default' or unknown - use original order from API
        break;
    }
    return sortableProjects;
  }, [projects, sortBy]);

  const handleFilterChange = (category: string) => {
    dispatch(setActiveCategoryFilter(category));
  };

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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Projects</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore a selection of our successfully completed projects across various sectors.
          </p>
        </motion.div>

        {/* Filtering & Sorting Controls Container */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center items-center flex-wrap gap-4 mb-12"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Category Filters */}
          <div className="flex justify-center flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-600 self-center mr-2">Filter by:</span>
            {projectCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleFilterChange(category)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 
                  ${
                    activeCategoryFilter === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sorting Dropdown/Select */}
          <div className="relative">
            <label htmlFor="sort-projects" className="text-sm font-medium text-gray-600 mr-2">
              Sort by:
            </label>
            <select
              id="sort-projects"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Project Grid - Handle loading/error states */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[300px]">
          {isLoading || isFetching ? (
            <div className="col-span-full flex justify-center items-center">
              <Spinner size="h-10 w-10" />
            </div>
          ) : error ? (
            <div className="col-span-full text-center text-red-600">
              <p>Error loading projects. Please try again later.</p>
              {/* Optional: {JSON.stringify(error)} */}
            </div>
          ) : projects.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              <p>No projects found matching the filter.</p>
            </div>
          ) : (
            sortedProjects.map((project: Project) => (
              <InteractiveCard
                key={project.projectId}
                imageSrc={project.image}
                imageAlt={project.title}
                title={project.title}
                description={project.description}
                category={project.category}
                linkHref={`/projects/${project.projectId}`}
                variants={itemVariants}
              />
            ))
          )}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Projects;
