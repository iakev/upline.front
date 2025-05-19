// Define the shape of the inputs managed by aboutSlice
export interface AboutInputState {
  title: string;
  content: string;
  image: string; // Store URL or reference
  isActive: boolean;
  // Add other fields relevant to an 'About' item form
}

// Define the shape of the pagination state managed by aboutSlice
export interface PaginationState {
  pageNumber: number;
  pageSize: number;
  // Add other pagination properties if needed (e.g., totalPages, totalRecords from API response)
}

// Define the overall config structure
export interface AboutConfig {
  aboutInputs: AboutInputState;
  pagination: PaginationState;
  paginationOptions: number[];
  // Add other configuration sections if needed
}

// Define the initial configuration
export const aboutConfig: AboutConfig = {
  aboutInputs: {
    title: '',
    content: '',
    image: '',
    isActive: true,
    // Initialize other fields
  },
  pagination: {
    pageNumber: 1,
    pageSize: 10,
  },
  paginationOptions: [10, 25, 50, 100],
  // Initialize other config sections
};

// --- Form Options ---
export interface FormFieldOption {
  key: keyof AboutInputState;
  type: 'text' | 'textarea' | 'file' | 'switch' | 'hidden'; // Add relevant types
  name: string;
  label: string;
  visible: boolean;
  editable: boolean;
}

export const aboutFormOptions: FormFieldOption[] = [
  { key: 'title', type: 'text', name: 'title', label: 'Title', visible: true, editable: true },
  { key: 'content', type: 'textarea', name: 'content', label: 'Content', visible: true, editable: true },
  { key: 'image', type: 'file', name: 'image', label: 'Image', visible: true, editable: true }, // Handle as file upload input
  { key: 'isActive', type: 'switch', name: 'isActive', label: 'Is Active?', visible: true, editable: true },
];
