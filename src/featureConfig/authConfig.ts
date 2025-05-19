// --- Interfaces ---
export interface RegisterInputState {
  username: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  gender?: string;
  thumbNail?: string;
  identifier: string; // Password
  policyType: string;
}

export interface LoginInputState {
  email: string;
  password: string;
}

export interface ForgotPasswordInputState {
  email: string;
}

export interface ResetPasswordInputState {
  password: string;
}

export interface AssignRoleInputState {
  actorId: number | '';
  definedRoleId: number | '';
  actorPermissionId?: number | '';
}

export interface AuthConfig {
  registerInputs: RegisterInputState;
  loginInputs: LoginInputState;
  forgotPasswordInputs: ForgotPasswordInputState;
  resetPasswordInputs: ResetPasswordInputState;
  assignRoleInputs: AssignRoleInputState;
  // No pagination needed here typically
}

// --- Initial Config State ---
export const authConfig: AuthConfig = {
  registerInputs: {
    username: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    gender: '',
    thumbNail: '',
    identifier: '', // Password
    policyType: 'default', // Set a default if applicable
  },
  loginInputs: {
    email: '',
    password: '',
  },
  forgotPasswordInputs: {
    email: '',
  },
  resetPasswordInputs: {
    password: '',
  },
  assignRoleInputs: {
    actorId: '',
    definedRoleId: '',
    actorPermissionId: '',
  },
};

// --- Form Options (Example for Registration) ---
export interface FormFieldOption {
  key:
    | keyof RegisterInputState
    | keyof LoginInputState
    | keyof ForgotPasswordInputState
    | keyof ResetPasswordInputState
    | keyof AssignRoleInputState;
  type: 'text' | 'email' | 'password' | 'tel' | 'file' | 'select' | 'number';
  name: string;
  label: string;
  visible: boolean;
  editable: boolean;
  options?: { value: string | number; label: string }[]; // For select inputs
}

export const registerFormOptions: FormFieldOption[] = [
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
  }, // Example options
  // { key: 'thumbNail', type: 'file', name: 'thumbNail', label: 'Profile Picture', visible: true, editable: true }, // Optional file input
  // policyType is usually set internally, not a user input field
];

export const loginFormOptions: FormFieldOption[] = [
  { key: 'email', type: 'email', name: 'email', label: 'Email Address', visible: true, editable: true },
  { key: 'password', type: 'password', name: 'password', label: 'Password', visible: true, editable: true },
];

// Add other FormOptions arrays as needed (forgotPassword, resetPassword, assignRole)
