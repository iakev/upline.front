import React from 'react';
// import { Link } from 'react-router-dom'; // If using router links
import { Linkedin, Twitter, Facebook, Instagram } from 'lucide-react'; // Import social icons
import Logo from '../../assets/logo.svg?react'; // Import the Logo component

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // TODO: Fetch links/socials dynamically if needed

  return (
    <footer className="bg-gray-800 text-gray-300 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Company Info */}
          <div className="md:col-span-1 lg:col-span-1">
            <a href="/" className="inline-block mb-4">
              <Logo className="h-8 w-auto" />
            </a>
            <p className="text-sm mb-4">
              Building excellence since [Year Founded]. We are committed to quality, integrity, and client satisfaction.
            </p>
            {/* Optional: Logo in footer? */}
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-1 lg:col-span-1">
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="hover:text-white hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white hover:underline">
                  Services
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-white hover:underline">
                  Projects
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-white hover:underline">
                  Blog
                </a>
              </li>{' '}
              {/* Assuming a blog page */}
              <li>
                <a href="#contact" className="hover:text-white hover:underline">
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-white hover:underline">
                  Privacy Policy
                </a>
              </li>{' '}
              {/* Example */}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="md:col-span-1 lg:col-span-1">
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <address className="text-sm not-italic space-y-2">
              <p>123 Construction Ave, Anytown</p>
              <p>Phone: (123) 456-7890</p>
              <p>
                Email:{' '}
                <a href="mailto:info@constructco.com" className="hover:text-white hover:underline">
                  info@constructco.com
                </a>
              </p>
            </address>
          </div>

          {/* Column 4: Social Media */}
          <div className="md:col-span-3 lg:col-span-1 md:text-center lg:text-left">
            <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex md:justify-center lg:justify-start space-x-4">
              <a href="#" aria-label="LinkedIn" className="hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center text-sm">
          <p>&copy; {currentYear} ConstructCo. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
