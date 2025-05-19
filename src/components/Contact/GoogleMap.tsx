import React from 'react';

// TODO: Configure Google Maps API Key
// You need to replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual API key.
// Also ensure the Google Maps JavaScript API is loaded, potentially in public/index.html
// or using a library like @react-google-maps/api.

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY'; // Placeholder

const GoogleMap: React.FC = () => {
  // Simple iframe embed - Replace with a more robust solution if needed (e.g., @react-google-maps/api)
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}
    &q=Space+Needle,Seattle+WA`; // TODO: Replace with actual company address/query

  if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
    return (
      <div className="w-full h-64 md:h-80 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">
        Google Maps API Key not configured.
        {/* TODO: Add instructions or link to configuration guide */}
      </div>
    );
  }

  return (
    <div className="w-full h-64 md:h-80 overflow-hidden rounded-lg shadow-md">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapSrc}
        title="Company Location Map"
      ></iframe>
    </div>
  );
};

export default GoogleMap;
