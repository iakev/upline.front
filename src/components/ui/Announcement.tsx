import React from 'react';

interface AnnouncementProps {
  message: string;
  'aria-live'?: 'polite' | 'assertive' | 'off';
}

/**
 * A visually hidden component to make announcements to screen readers.
 * Uses aria-live to control how updates are announced.
 * 'polite': Announces updates at the next graceful opportunity.
 * 'assertive': Announces updates immediately, potentially interrupting the user.
 */
const Announcement: React.FC<AnnouncementProps> = ({ message, 'aria-live': ariaLive = 'polite' }) => {
  // Basic visually hidden styles
  const visuallyHiddenStyle: React.CSSProperties = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    margin: '-1px',
    padding: '0',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    border: '0',
  };

  return (
    <div
      role="status" // Use role="status" for polite announcements, or role="alert" for assertive
      aria-live={ariaLive}
      aria-atomic="true" // Ensures the entire message is announced
      style={visuallyHiddenStyle}
    >
      {message}
    </div>
  );
};

export default Announcement;
