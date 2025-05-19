import React from 'react';
// import { Link } from 'react-router-dom'; // Uncomment when router is set up
import { smoothScrollTo } from '../../utils/smoothScroll'; // Import the utility

const Navigation: React.FC = () => {
  // TODO: Fetch navigation links dynamically if needed
  // TODO: Implement active link styling

  // TODO: Determine appropriate offset dynamically based on sticky header height
  const scrollOffset = 80; // Example offset, adjust as needed

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '#about' }, // Use hash links for now
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'Blog', href: '#blog' }, // Example link, adjust as needed
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      event.preventDefault(); // Prevent default jump
      const targetId = href.substring(1); // Remove the '#'
      smoothScrollTo(targetId, scrollOffset);
    } else {
      // Handle normal navigation (e.g., for / or /blog)
      // If using React Router, Link component will handle this
    }
  };

  return (
    <nav>
      <ul className="flex space-x-6">
        {navLinks.map((link) => (
          <li key={link.name}>
            {/* Replace <a> with <Link> when react-router-dom is integrated */}
            <a
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)} // Add onClick handler
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 pb-1 border-b-2 border-transparent hover:border-blue-600"
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
