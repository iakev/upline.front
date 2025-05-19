// --- Interfaces ---
export interface ContactFormInputState {
  name: string;
  email: string;
  message: string;
}

export interface PaginationState {
  pageNumber: number;
  pageSize: number;
}

export interface ContactFormConfig {
  contactFormInputs: ContactFormInputState;
  pagination: PaginationState; // For viewing submissions
  paginationOptions: number[];
}

// --- Initial Config State ---
export const contactFormConfig: ContactFormConfig = {
  contactFormInputs: {
    name: '',
    email: '',
    message: '',
  },
  pagination: {
    pageNumber: 1,
    pageSize: 10,
  },
  paginationOptions: [10, 25, 50, 100],
};

// --- Form Options (for the public contact form) ---
export interface FormFieldOption {
  key: keyof ContactFormInputState;
  type: 'text' | 'email' | 'textarea';
  name: string;
  label: string;
  visible: boolean;
  editable: boolean;
}

export const contactFormOptions: FormFieldOption[] = [
  { key: 'name', type: 'text', name: 'name', label: 'Your Name', visible: true, editable: true },
  { key: 'email', type: 'email', name: 'email', label: 'Your Email', visible: true, editable: true },
  { key: 'message', type: 'textarea', name: 'message', label: 'Your Message', visible: true, editable: true },
];
