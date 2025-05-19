import React, { useState, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Spinner from './components/ui/Spinner';
import { QuoteModal } from './components/Quote/QuoteModal';
import { SectionLayout } from './components/layout/SectionLayout';
import Hero from './components/Hero/Hero';

const AboutSection = lazy(() => import('./components/About/AboutSection'));
const Statistics = lazy(() => import('./components/Statistics/Statistics'));
const Projects = lazy(() => import('./components/Projects/Projects'));
const Services = lazy(() => import('./components/Services/Services'));
const CTA = lazy(() => import('./components/CTA/CTA'));
const Team = lazy(() => import('./components/Team/Team'));
const Registration = lazy(() => import('./components/Registration/Registration'));
const Contact = lazy(() => import('./components/Contact/Contact'));

const GlobalLoadingIndicator: React.FC = () => (
  <div className="fixed inset-0 flex justify-center items-center bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 z-50">
    <div className="flex items-center text-gray-700 dark:text-gray-300">
      <Spinner size="h-8 w-8" color="text-primary" />
      <span className="ml-3">Loading Content...</span>
    </div>
  </div>
);

const App = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const openQuoteModal = () => setIsQuoteModalOpen(true);
  const closeQuoteModal = () => setIsQuoteModalOpen(false);

  return (
    <>
      <Helmet>
        <title>Upline Developers Limited - Construction & Development</title>
        <meta
          name="description"
          content="Leading construction and development services in Kenya. Quality, integrity, and innovation in every project."
        />
      </Helmet>

      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
        <Header />

        <main className="flex-grow">
          <Suspense fallback={<GlobalLoadingIndicator />}>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Hero openQuoteModal={openQuoteModal} />
                    <SectionLayout id="about">
                      <AboutSection />
                    </SectionLayout>
                    <SectionLayout id="stats">
                      <Statistics />
                    </SectionLayout>
                    <SectionLayout id="projects" className="bg-gray-50 dark:bg-gray-800">
                      <Projects />
                    </SectionLayout>
                    <SectionLayout id="services">
                      <Services />
                    </SectionLayout>
                    <SectionLayout id="cta" className="bg-gray-100 dark:bg-gray-700">
                      <CTA onOpenQuoteModal={openQuoteModal} />
                    </SectionLayout>
                    <SectionLayout id="team">
                      <Team />
                    </SectionLayout>
                    <SectionLayout id="registrations" className="bg-gray-50 dark:bg-gray-800">
                      <Registration />
                    </SectionLayout>
                    <SectionLayout id="contact">
                      <Contact />
                    </SectionLayout>
                  </>
                }
              />
              <Route path="/about" element={<div>About Page</div>} />
              <Route path="/services" element={<div>Services Page</div>} />
              <Route path="/projects" element={<div>Projects Page</div>} />
              <Route path="/blog" element={<div>Blog Page</div>} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/quote" element={<div>Quote Page</div>} />
            </Routes>
          </Suspense>
        </main>

        <Footer />

        <QuoteModal isOpen={isQuoteModalOpen} onClose={closeQuoteModal} />
      </div>
    </>
  );
};

export default App;
