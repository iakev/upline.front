// Define the shape of the inputs managed by projectSlice (for potential admin forms)
export interface ProjectInputState {
  title: string;
  location: string;
  category: string;
  image: string; // Store URL or reference
  description?: string;
  startDate?: string;
  endDate?: string;
  address?: string; // Added based on backend validation
  coordinates?: [number, number] | null | string; // Store as tuple, null, or string '[lat,lon]'
  isActive: boolean;
  // Add other fields relevant to a project form
}

// Define the shape of the pagination state managed by projectSlice
export interface PaginationState {
  pageNumber: number;
  pageSize: number;
  // Add other pagination properties if needed
}

// Define the overall config structure for projects
export interface ProjectConfig {
  projectInputs: ProjectInputState;
  pagination: PaginationState;
  paginationOptions: number[];
  // Add other configuration sections if needed (e.g., filter options)
}

// Define the initial configuration for projects
export const projectConfig: ProjectConfig = {
  projectInputs: {
    title: '',
    location: '',
    category: '', // Maybe default to a specific category or 'All'?
    image: '',
    description: '',
    startDate: '',
    endDate: '',
    address: '',
    coordinates: null,
    isActive: true,
    // Initialize other fields
  },
  pagination: {
    pageNumber: 1,
    pageSize: 9, // Example: Default to 9 for a 3x3 grid
  },
  paginationOptions: [10, 25, 50, 100],
  // Initialize other config sections
};

// --- Form Options ---
export interface FormFieldOption {
  key: keyof ProjectInputState;
  // Add types like 'date', 'textarea', potentially 'map' for coordinates
  type: 'text' | 'textarea' | 'file' | 'switch' | 'date' | 'select' | 'hidden';
  name: string;
  label: string;
  visible: boolean;
  editable: boolean;
  options?: { value: string | number | boolean; label: string }[];
}

export const projectFormOptions: FormFieldOption[] = [
  { key: 'title', type: 'text', name: 'title', label: 'Project Title', visible: true, editable: true },
  {
    key: 'category',
    type: 'select',
    name: 'category',
    label: 'Category',
    visible: true,
    editable: true,
    options: [
      /* Add project categories */
    ],
  },
  { key: 'description', type: 'textarea', name: 'description', label: 'Description', visible: true, editable: true },
  { key: 'location', type: 'text', name: 'location', label: 'Location (City/Area)', visible: true, editable: true }, // Use this or address
  { key: 'address', type: 'text', name: 'address', label: 'Full Address', visible: true, editable: true }, // Use this or location
  { key: 'image', type: 'file', name: 'image', label: 'Main Image', visible: true, editable: true },
  { key: 'startDate', type: 'date', name: 'startDate', label: 'Start Date', visible: true, editable: true },
  { key: 'endDate', type: 'date', name: 'endDate', label: 'End Date', visible: true, editable: true },
  // { key: 'coordinates', type: 'map', name: 'coordinates', label: 'Coordinates', visible: true, editable: true }, // Example for custom handling
  { key: 'isActive', type: 'switch', name: 'isActive', label: 'Is Active?', visible: true, editable: true },
];
