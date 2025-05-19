import * as yup from 'yup';
import { isValidFileType, isValidSize } from '../../utils/validationUtils';

// Schema for adding/updating Project content
export const projectSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  image: yup
    .mixed<File>()
    .optional() // Assuming optional for update
    .test(
      'is-valid-type',
      'Invalid image type (jpg, png, gif, etc.)',
      (value) => !value || isValidFileType(value.name, 'image'),
    )
    .test('is-valid-size', 'Max allowed size is 5MB', (value) => !value || isValidSize(value)),
  address: yup.string().optional(), // Backend validation shows optional string
  coordinates: yup
    .array() // Array of two numbers
    .optional()
    .of(yup.number().required())
    .min(2, 'Coordinates must include Latitude and Longitude')
    .max(2, 'Coordinates must include Latitude and Longitude')
    .test('is-valid-lat-lon', 'Invalid Latitude/Longitude values', (value) => {
      if (!value) return true; // Allow empty array if optional
      if (value.length !== 2) return false; // Should be caught by min/max but double-check
      const [lat, lon] = value;
      return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
    }),
  category: yup.string().required('Category is required'), // Added based on Projects.tsx component
  location: yup.string().required('Location is required'), // Added based on Projects.tsx component
  isActive: yup.boolean().optional(), // Assuming this might exist based on other schemas
  // Add other fields like startDate, endDate if needed
});

// Schema for Project list filtering/pagination (if needed)
// export const getProjectsFilterSchema = yup.object().shape({...});
