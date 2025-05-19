import * as yup from 'yup';
import { isValidFileType, isValidSize } from '../../utils/validationUtils';

// Schema for adding/updating Service content
export const serviceSchema = yup.object().shape({
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
  isActive: yup.boolean().optional(), // Assuming this might exist
});

// Schema for Service list filtering/pagination (if needed)
// export const getServicesFilterSchema = yup.object().shape({...});
