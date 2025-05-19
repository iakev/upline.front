// --- Interfaces ---
export interface ServiceInputState {
  title: string;
  description: string;
  image: string; // Store URL or reference
  // Add other fields if needed for service forms
}

export interface PaginationState {
  pageNumber: number;
  pageSize: number;
}

export interface ServiceConfig {
  serviceInputs: ServiceInputState;
  pagination: PaginationState;
  paginationOptions: number[];
}

// --- Initial Config State ---
export const serviceConfig: ServiceConfig = {
  serviceInputs: {
    title: '',
    description: '',
    image: '',
  },
  pagination: {
    pageNumber: 1,
    pageSize: 10,
  },
  paginationOptions: [10, 25, 50, 100],
};

// --- Form Options ---
export interface FormFieldOption {
  key: keyof ServiceInputState;
  type: 'text' | 'textarea' | 'file' | 'hidden';
  name: string;
  label: string;
  visible: boolean;
  editable: boolean;
}

export const serviceFormOptions: FormFieldOption[] = [
  { key: 'title', type: 'text', name: 'title', label: 'Service Title', visible: true, editable: true },
  { key: 'description', type: 'textarea', name: 'description', label: 'Description', visible: true, editable: true },
  { key: 'image', type: 'file', name: 'image', label: 'Service Image', visible: true, editable: true },
];
