// --- Interfaces ---
export interface UserInputState {
  username: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  gender?: string;
  thumbNail?: string;
  actorId: number | ''; // Included for context, might be set differently
  identifier: string; // Password
  policyType: string;
}

export interface UpdateUserInputState {
  primaryLanguageId?: number | '';
  isEnabled?: boolean;
  isLocked?: boolean;
  // Note: actorId is a URL param, not in the body for update
}

export interface PaginationState {
  pageNumber: number;
  pageSize: number;
}

export interface UsersConfig {
  usersInputs: UserInputState; // For adding a new user
  updateUsersInputs: UpdateUserInputState; // For updating user status
  pagination: PaginationState;
  paginationOptions: number[];
}

// --- Initial Config State ---
export const usersConfig: UsersConfig = {
  usersInputs: {
    username: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    gender: '',
    thumbNail: '',
    actorId: '', // May need to be set programmatically
    identifier: '',
    policyType: 'default',
  },
  updateUsersInputs: {
    primaryLanguageId: '',
    isEnabled: true,
    isLocked: false,
  },
  pagination: {
    pageNumber: 1,
    pageSize: 10,
  },
  paginationOptions: [10, 25, 50, 100],
};

// --- Form Options ---
export interface FormFieldOption {
  key: keyof UserInputState | keyof UpdateUserInputState;
  type: 'text' | 'email' | 'password' | 'tel' | 'file' | 'select' | 'number' | 'switch';
  name: string;
  label: string;
  visible: boolean;
  editable: boolean;
  options?: { value: string | number | boolean; label: string }[];
}

// Example for Adding a User (similar to registration)
export const addUserFormOptions: FormFieldOption[] = [
  { key: 'username', type: 'text', name: 'username', label: 'Username', visible: true, editable: true },
  { key: 'fullName', type: 'text', name: 'fullName', label: 'Full Name', visible: true, editable: true },
  { key: 'phoneNumber', type: 'tel', name: 'phoneNumber', label: 'Phone Number', visible: true, editable: true },
  { key: 'email', type: 'email', name: 'email', label: 'Email Address', visible: true, editable: true },
  { key: 'identifier', type: 'password', name: 'identifier', label: 'Password', visible: true, editable: true },
  {
    key: 'gender',
    type: 'select',
    name: 'gender',
    label: 'Gender',
    visible: true,
    editable: true,
    options: [
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' },
      { value: 'Other', label: 'Other' },
    ],
  },
  // { key: 'thumbNail', type: 'file', name: 'thumbNail', label: 'Profile Picture', visible: true, editable: true },
];

// Example for Updating User Status
export const updateUserFormOptions: FormFieldOption[] = [
  { key: 'isEnabled', type: 'switch', name: 'isEnabled', label: 'Enabled', visible: true, editable: true },
  { key: 'isLocked', type: 'switch', name: 'isLocked', label: 'Locked', visible: true, editable: true },
  // primaryLanguageId might be a select dropdown if you have languages defined
  // { key: 'primaryLanguageId', type: 'select', name: 'primaryLanguageId', label: 'Language', visible: true, editable: true, options: [...] },
];

// Role assignment inputs/forms could also be defined here or in authConfig
