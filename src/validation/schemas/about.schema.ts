import * as yup from 'yup';
import { isValidFileType, isValidSize } from '../../utils/validationUtils';

// Schema for adding/updating About section content
export const aboutUsSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  content: yup.string().required('Content is required'),
  image: yup
    .mixed<File>() // Handle File object for validation
    .optional() // Optional for update, might be required for add depending on logic
    .test(
      'is-valid-type',
      'Invalid image type (jpg, png, gif, etc.)',
      (value) => !value || isValidFileType(value.name, 'image'),
    )
    .test('is-valid-size', 'Max allowed size is 5MB', (value) => !value || isValidSize(value)),
  isActive: yup.boolean().optional(), // Backend validation shows optional
  // Remove mission/vision unless backend supports them
  // mission: yup.string().optional(),
  // vision: yup.string().optional(),
});

// Schema for About list filtering/pagination (if needed)
// export const getAboutsFilterSchema = yup.object().shape({...});
