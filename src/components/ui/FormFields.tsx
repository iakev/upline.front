import React, { useState, useEffect, forwardRef, ForwardedRef, ChangeEvent, SetStateAction, Dispatch, useMemo } from 'react';

// Import our basic UI components from the same directory
import { Field } from './Field';
import { Label } from './Label';
import { Fieldset } from './Fieldset';
import { Legend } from './Legend';
import { FieldGroup } from './FieldGroup';
import { Select } from './Select';
import { Input } from './Input';
import { Text } from './Text';
import { Textarea } from './Textarea';
import { Checkbox } from './Checkbox';
import { SearchWithDropdown } from './SearchWithDropdown'; // Import the SearchWithDropdown component
import logger from '../../utils/logger'; // Added logger import

// Interfaces for Props and Options
// Keep OptionItem specific to this component's configuration needs
export interface OptionItem {
  id: string | number;
  name: string;
  [key: string]: any; // Allow other properties
}

interface DependencyConfig {
  field: string;
  condition?: 'equals' | 'notEquals' | 'isEmpty' | 'isNotEmpty' | 'contains' | 'greaterThan' | 'lessThan'; // Added more conditions
  value?: any;
  showWhen?: boolean;
}

// Define a type for the action creators passed via props
// Replace 'any' with more specific types if available from your Redux setup
type GenericActionCreator = (...args: any[]) => any;

export interface OptionConfig {
  key: string; // Unique key for React list rendering
  name: string; // Corresponds to key in inputs state object
  label: string;
  type:
    | 'select'
    | 'textarea'
    | 'file'
    | 'searchWithDropdown'
    | 'checkbox'
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'date'
    | 'url'
    | 'tel'; // Extend input types as needed
  items?: OptionItem[]; // For select or SearchWithDropdown items
  editable: boolean;
  visible?: boolean; // Initial visibility
  dependency?: DependencyConfig; // Conditional visibility rules
  defaultSelect?: string; // e.g., "items[0]" or specific item name
  // Props specific to certain types like searchWithDropdown - ensure these match SearchWithDropdownProps
  dispatch?: Dispatch<any>;
  setErrorDialog?: GenericActionCreator;
  validateInput?: (...args: any[]) => any;
  fetchItems?: GenericActionCreator;
  setSelected?: (item: OptionItem) => void; // Matches the corrected SearchWithDropdown prop
  url?: string;
  action?: 'POST' | 'GET' | 'PUT' | 'DELETE';
  clearInputRef?: React.Ref<{ clearInput: () => void }>;
  placeHolder?: string;
  setPlaceHolder?: Dispatch<SetStateAction<string>>;
  itemKeyField?: string;
  itemDisplayField?: string;
  // Add any other props needed by SearchWithDropdown or other custom types
}

export interface LayoutConfig {
  legend: string;
  description?: string;
  gridClass?: string; // CSS class for grid layout (e.g., Tailwind grid classes)
}

interface FormFieldsProps {
  inputs: { [key: string]: any };
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  options: OptionConfig[];
  layout: LayoutConfig;
  imageUrl?: string | null; // For displaying an existing image (e.g., in an edit form)
  errors?: { [key: string]: string | null }; // Optional: Pass errors down for field-specific display
}

/**
 * FormFields Component
 * Renders a dynamic form based on the provided options configuration.
 * Uses basic UI components and handles conditional field visibility.
 */
export const FormFields = forwardRef<HTMLInputElement, FormFieldsProps>(
  ({ inputs, handleInputChange, options, layout, imageUrl, errors }, ref: ForwardedRef<HTMLInputElement | null>) => {
    // Initialize field visibility based on static `visible` prop and absence of dependency
    const initialVisibility = useMemo(() => {
      return options.reduce<{ [key: string]: boolean }>((acc, option) => {
        acc[option.key] = option.visible !== false && !option.dependency;
        return acc;
      }, {});
    }, [options]);

    const [fieldVisibility, setFieldVisibility] = useState<{ [key: string]: boolean }>(initialVisibility);

    // Effect to handle default select values on initial load or when options change
    useEffect(() => {
      const processedOptions = new Set<string>();
      let changesMade = false;
      const changesToApply: { name: string; value: any }[] = [];

      options.forEach((option) => {
        // Skip if already processed, not a select, no default config, no items, or already has a value
        if (
          processedOptions.has(option.name) ||
          option.type !== 'select' ||
          !option.defaultSelect ||
          !option.items ||
          option.items.length === 0 ||
          inputs[option.name]
        ) {
          return;
        }

        let defaultValueItem: OptionItem | undefined = undefined;
        try {
          if (option.defaultSelect.startsWith('items')) {
            const indexMatch = option.defaultSelect.match(/\[(\d+)\]/);
            const index = indexMatch ? parseInt(indexMatch[1], 10) : 0;
            defaultValueItem = option.items[index];
          } else {
            defaultValueItem = option.items.find((item) => item.name === option.defaultSelect);
          }

          if (defaultValueItem?.id) {
            // Stage the change instead of calling handleInputChange directly
            changesToApply.push({ name: option.name, value: defaultValueItem.id });
            processedOptions.add(option.name);
            changesMade = true;
          }
        } catch (_error) {
          // console.error(`Error processing default select for ${option.name}:`, error); // Removed
          logger.error(`Error processing default select for ${option.name}:`, _error); // Use logger
        }
      });

      // Apply staged changes after the loop to avoid potential state inconsistencies
      if (changesMade) {
        changesToApply.forEach((change) => {
          // Simulate event object for handleInputChange
          handleInputChange({ target: { name: change.name, value: change.value } } as ChangeEvent<HTMLSelectElement>);
        });
      }
      // Only run when options structure changes or if inputs reset (clearing selected values)
    }, [options, handleInputChange]); // Removed inputs dependency to prevent loops, handleInputChange should be stable

    // Effect to update field visibility based on dependencies when inputs change
    useEffect(() => {
      let visibilityChanged = false;
      const updatedVisibility = { ...fieldVisibility }; // Start with current visibility

      options.forEach((option) => {
        const currentVisibility = updatedVisibility[option.key];
        let newVisibility = option.visible !== false; // Default to true unless explicitly false

        if (option.dependency) {
          const { field: depField, condition = 'equals', value: depValue, showWhen = true } = option.dependency;

          const dependentFieldValue = inputs[depField];
          let conditionMet = false;

          // Evaluate the condition
          switch (condition) {
            case 'equals':
              conditionMet = String(dependentFieldValue) === String(depValue);
              break;
            case 'notEquals':
              conditionMet = String(dependentFieldValue) !== String(depValue);
              break;
            case 'isEmpty':
              conditionMet = dependentFieldValue === null || dependentFieldValue === undefined || dependentFieldValue === '';
              break;
            case 'isNotEmpty':
              conditionMet = dependentFieldValue !== null && dependentFieldValue !== undefined && dependentFieldValue !== '';
              break;
            case 'contains':
              conditionMet = String(dependentFieldValue).includes(String(depValue));
              break;
            case 'greaterThan':
              conditionMet = Number(dependentFieldValue) > Number(depValue);
              break;
            case 'lessThan':
              conditionMet = Number(dependentFieldValue) < Number(depValue);
              break;
            default:
              // console.warn(`Unsupported dependency condition: ${condition}`); // Removed
              conditionMet = false;
          }
          // Determine visibility: true if (conditionMet and showWhen=true) OR (not conditionMet and showWhen=false)
          newVisibility = conditionMet === showWhen;
        }

        if (newVisibility !== currentVisibility) {
          updatedVisibility[option.key] = newVisibility;
          visibilityChanged = true;
        }
      });

      // Only update state if visibility has actually changed to prevent infinite loops
      if (visibilityChanged) {
        setFieldVisibility(updatedVisibility);
      }
    }, [options, inputs, fieldVisibility]); // Re-evaluate when options, inputs, or visibility state change

    // Function to render the correct field type based on option config
    const renderField = (option: OptionConfig) => {
      const commonProps: any = {
        name: option.name,
        onChange: handleInputChange,
        disabled: !option.editable,
        key: option.key,
        id: `${layout.legend.replace(/\s+/g, '-').toLowerCase()}-${option.name}`, // Auto-generate ID
      };

      if (option.type !== 'file') {
        commonProps.value = inputs[option.name] ?? '';
      }
      if (option.type === 'checkbox') {
        commonProps.checked = !!inputs[option.name];
      }

      switch (option.type) {
        case 'select':
          return (
            <Select {...commonProps} className="mt-1">
              <option value="" disabled>{`Choose ${option.label}`}</option>
              {option.items?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          );
        case 'textarea':
          return <Textarea {...commonProps} className="mt-1" />;
        case 'file':
          // Pass the forwarded ref specifically to the file input
          // Note: File input `value` is not controlled in React
          return (
            <Input
              type="file"
              name={option.name}
              onChange={handleInputChange}
              ref={ref}
              disabled={!option.editable}
              id={commonProps.id}
              className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900 dark:file:text-indigo-100 dark:hover:file:bg-indigo-800"
            />
          );
        case 'searchWithDropdown':
          // Ensure all required props for SearchWithDropdown are passed from option config
          return (
            <div className="mt-1">
              <SearchWithDropdown
                dispatch={option.dispatch!} // Add non-null assertion or provide default
                setErrorDialog={option.setErrorDialog!} // Add non-null assertion or provide default
                validateInput={option.validateInput}
                fetchItems={option.fetchItems!} // Add non-null assertion or provide default
                setSelected={option.setSelected!} // Add non-null assertion or provide default
                items={option.items || []}
                fieldName={option.name}
                url={option.url!} // Add non-null assertion or provide default
                action={option.action}
                clearInputRef={option.clearInputRef}
                placeHolder={option.placeHolder}
                setPlaceHolder={option.setPlaceHolder}
                itemKeyField={option.itemKeyField}
                itemDisplayField={option.itemDisplayField}
                id={commonProps.id}
              />
            </div>
          );
        case 'checkbox': {
          // Remove value, use checked; id comes from commonProps
          const { value: _value, ...checkboxProps } = commonProps;
          return (
            <div className="flex items-center mt-1">
              <Checkbox type="checkbox" {...checkboxProps} id={commonProps.id} className="mr-2" />
            </div>
          );
        }
        default: {
          // Handles 'text', 'email', 'password', 'number', 'date', 'url', 'tel' etc.
          // Ensure ref is not passed to non-file inputs
          const { ref: _discardedRef, ...inputProps } = commonProps;
          return <Input type={option.type} {...inputProps} id={commonProps.id} className="mt-1" />;
        }
      }
    };

    return (
      <Fieldset>
        {' '}
        {/* TODO: Add Tailwind styles */}
        <Legend>{layout.legend}</Legend> {/* TODO: Add Tailwind styles */}
        {layout.description && <Text className="mt-1 mb-4">{layout.description}</Text>} {/* Added margins */}
        <FieldGroup>
          {' '}
          {/* TODO: Add Tailwind styles */}
          <div className={layout.gridClass ?? 'grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6'}>
            {' '}
            {/* Default basic grid */}
            {options.map(
              (option) =>
                fieldVisibility[option.key] && (
                  <Field key={option.key}>
                    {' '}
                    {/* TODO: Add Tailwind styles */}
                    <Label htmlFor={`${layout.legend.replace(/\s+/g, '-').toLowerCase()}-${option.name}`}>
                      {option.label}
                    </Label>{' '}
                    {/* TODO: Add Tailwind styles */}
                    {renderField(option)}
                    {/* Display field-specific errors */}
                    {errors?.[option.name] && (
                      <Text className="text-red-600 text-sm mt-1">
                        <small>{errors[option.name]}</small>
                      </Text>
                    )}
                  </Field>
                ),
            )}
            {/* Display existing image if URL is provided */}
            {imageUrl && (
              <Field className="sm:col-span-full">
                <Label>Current Image</Label>
                <img
                  src={imageUrl}
                  alt="Current visual representation"
                  className="mt-1 max-w-xs max-h-40 block border border-gray-200 rounded shadow-sm dark:border-gray-600"
                />
              </Field>
            )}
          </div>
        </FieldGroup>
      </Fieldset>
    );
  },
);

FormFields.displayName = 'FormFields';
