// Maximum file size in bytes (e.g., 5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
// Adjust this value as needed, 3GB seemed excessive. Let's use 5MB as a more typical example.

// Allowed file extensions for different types
export const validFileExt = {
  // Add other types if needed (e.g., 'document', 'video')
  image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'],
};

// Type definition for the keys of validFileExt
export type FileTypeCategory = keyof typeof validFileExt;
