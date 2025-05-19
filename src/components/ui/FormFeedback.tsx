import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Announcement from './Announcement'; // Import the Announcement component
// Import icons (optional)
// import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid';

interface FormFeedbackProps {
  message: string | null;
  type: 'success' | 'error';
  className?: string;
  // Optional: Callback to clear the status after a delay
  onDismiss?: () => void;
  dismissDelay?: number; // Delay in ms
}

/**
 * Displays feedback messages (success or error) for forms.
 * Uses framer-motion for animations.
 */
const FormFeedback: React.FC<FormFeedbackProps> = ({
  message,
  type,
  className = '',
  onDismiss: _onDismiss,
  dismissDelay: _dismissDelay = 5000,
}) => {
  const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const textColor = type === 'success' ? 'text-green-700' : 'text-red-700';
  const borderColor = type === 'success' ? 'border-green-400' : 'border-red-400';

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={`p-4 mb-4 text-sm rounded-lg border ${bgColor} ${textColor} ${borderColor} ${className}`}
          role={type === 'error' ? 'alert' : 'status'} // Use 'alert' for errors, 'status' for success
        >
          {/* Optional Icon */}
          {/* {type === 'success' ? <CheckCircleIcon className="h-5 w-5 mr-2 inline" /> : <XCircleIcon className="h-5 w-5 mr-2 inline" />} */}
          <p>{message}</p>
          {/* Announce the message to screen readers */}
          <Announcement message={message} aria-live={type === 'success' ? 'polite' : 'assertive'} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FormFeedback;
