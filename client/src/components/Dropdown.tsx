import React, { useState, useRef, useEffect } from "react";

type DropdownProps = {
  label?: string;
  options: string[];
  selected?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  className?: string;
};

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  selected,
  onSelect,
  placeholder = "Select an option",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {label && <label className="block mb-1 text-sm font-medium">{label}</label>}

      <div>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
        >
          {selected || placeholder}
          <span className="float-right ml-2">▾</span>
        </button>

        {isOpen && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className={`cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 ${
                  selected === option ? "bg-gray-100 font-semibold" : ""
                }`}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
