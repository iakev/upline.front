import React, { useState, useRef, useImperativeHandle, useEffect, ChangeEvent, SetStateAction, Dispatch } from 'react';
import { Input } from './Input'; // Use our basic Input component
// import { useSelector } from 'react-redux'; // Keep if needed, but props are preferred for actions

// Placeholder for SearchIcon - replace with an actual icon component or SVG
const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className || 'w-6 h-6'}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

// Interface definitions
// Use a more specific item type, matching what FormFields expects
interface OptionItem {
  id: string | number;
  name: string;
  [key: string]: any; // Allow other properties
}

interface FetchItemsArgs {
  params: { [key: string]: any };
  method: { url: string; action: 'POST' | 'GET' | 'PUT' | 'DELETE' };
}

interface SearchWithDropdownProps {
  id?: string;
  dispatch: Dispatch<any>; // Consider more specific action types
  setErrorDialog: (payload: { alert: { show: boolean; message: string; title: string } }) => void; // Prop for error action
  validateInput?: (name: string, value: string) => Promise<string | null> | string | null; // Validation function prop
  fetchItems: (args: FetchItemsArgs) => void; // Action creator prop for fetching items
  fieldName: string;
  setSelected: (item: OptionItem) => void; // Use OptionItem type
  items: OptionItem[]; // Use OptionItem type
  url: string; // URL for fetching items
  action?: 'POST' | 'GET' | 'PUT' | 'DELETE'; // HTTP method for fetching
  clearInputRef?: React.Ref<{ clearInput: () => void }>; // Ref object to expose clearInput method
  placeHolder?: string;
  setPlaceHolder?: Dispatch<SetStateAction<string>>; // To update placeholder after selection
  itemKeyField?: string; // Field name in item object to use as key
  itemDisplayField?: string; // Field name in item object to display
}

export const SearchWithDropdown: React.FC<SearchWithDropdownProps> = ({
  id,
  dispatch,
  setErrorDialog,
  validateInput,
  fetchItems,
  fieldName,
  setSelected,
  items = [],
  url = '',
  action = 'POST',
  clearInputRef,
  placeHolder = 'Search...',
  setPlaceHolder,
  itemKeyField = 'id',
  itemDisplayField = 'name',
}) => {
  const [inputValue, setInputValue] = useState('');
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Expose clearInput method via ref
  useImperativeHandle(clearInputRef, () => ({
    clearInput: () => {
      setInputValue('');
      setIsDropdownVisible(false);
    },
  }));

  // Handle clicks outside the component to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (debounceTimeout.current) {
        // Clear timeout on unmount
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  // Debounced input change handler
  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    setInputValue(value);
    // Show dropdown immediately if typing, let fetchItems update visibility based on results
    // setIsDropdownVisible(value.length > 0);

    debounceTimeout.current = setTimeout(async () => {
      if (validateInput) {
        const error = await validateInput(name, value);
        if (error) {
          dispatch(
            setErrorDialog({
              alert: {
                show: true,
                message: `Validation Error: ${error}`,
                title: 'Input Error',
              },
            }),
          );
          // Decide if fetching should proceed despite validation error
        }
      }
      // Trigger fetch after debounce even if input is empty, API should handle it
      // Or add condition: if (value.length > 0)
      if (value.trim()) {
        // Only search if input is not empty
        handleSearch(value); // Pass current value to search
      } else {
        // Optionally clear results or handle empty input state
        setIsDropdownVisible(false);
      }
    }, 500); // Debounce time
  };

  // Handler to trigger fetch action
  const handleSearch = async (currentValue: string) => {
    // setIsDropdownVisible(false); // Let useEffect handle visibility based on items
    dispatch(
      fetchItems({
        params: {
          [fieldName]: currentValue, // Use the debounced value
          pageNumber: 1, // Add pagination if needed
          pageSize: 10,
        },
        method: {
          url: url,
          action: action || 'POST',
        },
      }),
    );
  };

  // Handler for selecting an item from the dropdown
  const onSelect = (item: OptionItem) => {
    setSelected(item); // Call the parent callback
    setIsDropdownVisible(false);
    setInputValue(''); // Clear input after selection

    // Update placeholder if prop provided
    if (setPlaceHolder) {
      setPlaceHolder(item[itemDisplayField] || 'Selected Item');
    }
  };

  // Effect to control dropdown visibility based on items array
  useEffect(() => {
    // Only show dropdown if there are items AND the input has focus (or interaction intended)
    // For simplicity now, show if items exist. Refine later if needed.
    setIsDropdownVisible(items.length > 0 && document.activeElement === containerRef.current?.querySelector('input'));
  }, [items]);

  const dropdownChildren = items.map((item, idx) => {
    const key = item[itemKeyField] !== undefined ? item[itemKeyField] : idx;
    const displayText = item[itemDisplayField] !== undefined ? item[itemDisplayField] : `Item ${idx + 1}`;

    return (
      <li // Use li for semantic list items
        key={key}
        className="px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer rounded-md mx-1 my-0.5"
        onClick={() => onSelect(item)}
        role="option"
        aria-selected={false} // Manage selection state if needed
        tabIndex={-1} // Allow keyboard navigation if implemented later
      >
        {displayText}
      </li>
    );
  });

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input container with focus styles */}
      <div className="relative flex items-center w-full rounded-md shadow-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 dark:focus-within:border-blue-500 dark:focus-within:ring-blue-500">
        <Input
          id={id}
          type="text"
          name={fieldName}
          placeholder={placeHolder}
          value={inputValue}
          onChange={handleInputChange}
          // Removed redundant styles inherited from Input, added padding for icon
          className="flex-grow bg-transparent py-2 pl-3 pr-10 border-none focus:ring-0 sm:text-sm dark:text-white dark:placeholder:text-gray-400"
          aria-haspopup="listbox"
          aria-expanded={isDropdownVisible}
          autoComplete="off" // Prevent browser autocomplete interfering
          onFocus={() => {
            if (items.length > 0) setIsDropdownVisible(true);
          }} // Show dropdown on focus if items exist
          onBlur={() => setTimeout(() => setIsDropdownVisible(false), 150)} // Delay blur to allow click on dropdown
        />
        <button
          type="button" // Important: Prevent form submission
          onClick={() => handleSearch(inputValue)} // Trigger search manually if needed
          className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-r-md"
          title="Search"
        >
          <SearchIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Dropdown List */}
      {isDropdownVisible && dropdownChildren.length > 0 && (
        <ul // Use ul for semantic list
          className="absolute left-0 top-full z-20 mt-1 w-full max-h-60 overflow-auto rounded-md border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="listbox"
        >
          {dropdownChildren}
        </ul>
      )}
    </div>
  );
};

SearchWithDropdown.displayName = 'SearchWithDropdown';
