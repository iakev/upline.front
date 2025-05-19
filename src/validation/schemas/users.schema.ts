import * as yup from 'yup';
import { isValidFileType, isValidSize } from '../../utils/validationUtils';

// Schema for adding a new user (similar to registration)
export const addUserSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  fullName: yup.string().required('Full name is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  gender: yup.string().optional(),
  thumbNail: yup
    .mixed<File>()
    .optional()
    .test(
      'is-valid-type',
      'Invalid image type (jpg, png, gif, etc.)',
      (value) => !value || isValidFileType(value.name, 'image'),
    )
    .test('is-valid-size', 'Max allowed size is 5MB', (value) => !value || isValidSize(value)),
  actorId: yup.number().required(), // Assuming actorId is required in the body for adding?
  identifier: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, 'Password must contain at least one letter and one number'),
  policyType: yup.string().required(),
});

// Schema for updating user details (only fields allowed by backend)
export const updateUserSchema = yup.object().shape({
  // Note: actorId is a URL param, not validated here
  primaryLanguageId: yup.number().optional(),
  isEnabled: yup.boolean().optional(),
  isLocked: yup.boolean().optional(),
  // Add other updateable fields if backend allows
});

// Schema for user list filtering/pagination (if needed for validating query params/body)
// export const getUsersFilterSchema = yup.object().shape({...});

// Role assignment schemas might be reused from auth.schema.ts or defined here
