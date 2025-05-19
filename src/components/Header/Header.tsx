import React, { useState, Fragment } from 'react';
import Navigation from '../Navigation/Navigation'; // Assuming Navigation component exists
import { Dialog, Transition } from '@headlessui/react'; // Import Headless UI components
import { useStickyHeader } from '../../hooks/useStickyHeader'; // Assuming hook exists
import Logo from '../../assets/logo.svg?react'; // Correct SVG component import

const Header: React.FC = () => {
  const isSticky = useStickyHeader(10); // Use the hook, trigger after 10px scroll
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // TODO: Implement sticky header logic using useStickyHeader hook
  // TODO: Add contact information display properly (maybe top bar or within mobile menu)

  return (
    // Apply dynamic classes based on isSticky state
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${isSticky ? 'bg-white shadow-lg' : 'bg-transparent pt-4'}`}
    >
      {/* Optional: Top bar shown only when sticky */}
      <Transition
        show={isSticky}
        as={Fragment}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="bg-gray-100 text-xs text-gray-600">
          <div className="container mx-auto px-4 py-1 flex justify-between items-center">
            {/* Add Icons Later */}
            <div className="flex items-center space-x-4">
              <span>+1 (123) 456-7890</span>
              <span>info@constructco.com</span>
            </div>
            <div>Working Hours: Mon-Fri 8:00 AM - 5:00 PM</div>
          </div>
        </div>
      </Transition>

      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo Placeholder - Adjust size when sticky */}
        <div className="text-xl font-bold text-gray-800">
          {' '}
          {/* Container for sizing/styling */}
          <a href="/">
            {/* Replace with actual Logo component/image later */}
            {/* <span className={`transition-all duration-300 ${isSticky ? 'text-lg' : 'text-xl'}`}>CONSTRUCTCO</span> */}
            <Logo className={`transition-all duration-300 ${isSticky ? 'h-16 w-auto' : 'h-16 w-auto'}`} />{' '}
            {/* Use SVG, adjust size */}
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          {' '}
          {/* Hide on small screens */}
          <Navigation />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          {' '}
          {/* Show only on small screens */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
            aria-label="Open main menu"
          >
            {/* Hamburger Icon */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        {/* Desktop Contact Info / CTA Button */}
        <div className="hidden md:flex items-center space-x-4">
          {' '}
          {/* Use flex and items-center */}
          <span className="text-sm text-gray-600">(123) 456-7890</span> {/* Add Icon later */}
          <a href="#contact" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium">
            Contact Us
          </a>
        </div>
      </div>

      {/* Mobile Menu Panel (using Headless UI) */}
      <Transition appear show={isMobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 md:hidden" onClose={setIsMobileMenuOpen}>
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" aria-hidden="true" />
          </Transition.Child>

          {/* Sliding Panel */}
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300 sm:duration-500"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300 sm:duration-500"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="w-screen max-w-md">
                <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                  <div className="px-4 sm:px-6 flex justify-between items-start">
                    <Dialog.Title className="text-lg font-semibold text-gray-900">Menu</Dialog.Title>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-label="Close panel"
                      >
                        <span className="sr-only">Close panel</span>
                        {/* X Icon */}
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    {/* Mobile Navigation - Render Navigation component inside */}
                    <div className="flex flex-col space-y-4">
                      {/* Example: Manually listing links or passing props to Navigation */}
                      <a
                        href="/"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        Home
                      </a>
                      <a
                        href="#about"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        About
                      </a>
                      <a
                        href="#services"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        Services
                      </a>
                      <a
                        href="#projects"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        Projects
                      </a>
                      <a
                        href="#blog"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        Blog
                      </a>
                      <a
                        href="#contact"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        Contact
                      </a>
                      <hr className="my-4" />
                      {/* Mobile Contact Info */}
                      <div className="px-3 py-2 text-sm text-gray-500">
                        <p>(123) 456-7890</p>
                        <p>info@constructco.com</p>
                      </div>
                      <a
                        href="#contact"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                      >
                        Contact Us
                      </a>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </header>
  );
};

export default Header;
