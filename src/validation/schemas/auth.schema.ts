import * as yup from 'yup';
import { isValidFileType, isValidSize } from '../../utils/validationUtils';

// Registration Schema
export const registerSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  fullName: yup.string().required('Full name is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  // Add regex for phone number format if needed
  // .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  gender: yup.string().optional(),
  thumbNail: yup
    .mixed<File>() // Use yup.mixed<File>() for File type
    .optional()
    .test(
      'is-valid-type',
      'Invalid image type (jpg, png, gif, etc.)',
      (value) => !value || isValidFileType(value.name, 'image'),
    ) // Check only if value exists
    .test('is-valid-size', 'Max allowed size is 5MB', (value) => !value || isValidSize(value)),
  identifier: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    // Example: Require at least one letter and one number
    .matches(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, 'Password must contain at least one letter and one number'),
  policyType: yup.string().required(), // Usually not validated on frontend input
});

// Login Schema
export const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
});

// Forgot Password Schema
export const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
});

// Reset Password Schema
export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, 'Password must contain at least one letter and one number'),
  // Add confirmPassword field if needed:
  // confirmPassword: yup.string()
  //   .oneOf([yup.ref('password'), null], 'Passwords must match')
  //   .required('Confirm Password is required'),
});

// Assign Role Schema
export const assignRoleSchema = yup.object().shape({
  actorId: yup.number().integer().positive('User ID must be positive').required('User ID is required'),
  definedRoleId: yup.number().integer().positive('Role ID must be positive').required('Role ID is required'),
  actorPermissionId: yup.number().integer().positive('Permission ID must be positive').optional(),
});

// Edit Assigned Role Schema
export const editAssignRoleSchema = yup.object().shape({
  // Making fields optional for editing
  actorId: yup.number().integer().positive('User ID must be positive').optional(),
  definedRoleId: yup.number().integer().positive('Role ID must be positive').optional(),
  actorPermissionId: yup.number().integer().positive('Permission ID must be positive').optional(),
});
