import React from 'react';

export interface Option {
  id: string;
  label: string;
  disabled?: boolean;
}

interface ThreeColumnSelectorProps {
  title: string;
  options: Option[];
  selected: string[];
  onToggle: (id: string, replace?: boolean) => void;
}

export default function ThreeColumnSelector({
  title,
  options,
  selected,
  onToggle,
}: ThreeColumnSelectorProps) {
  const handleToggle = (id: string, optionDisabled?: boolean) => {
    if (optionDisabled) return;
    onToggle(id);
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">{title}</h2>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => (
          <div
            key={option.id}
            className={`flex items-center gap-2 ${
              option.disabled ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <input
              type="checkbox"
              id={`${option.id}`}
              checked={selected.includes(option.id)}
              onChange={() => handleToggle(option.id, option.disabled)}
              disabled={option.disabled}
              className="cursor-pointer"
            />
            <label htmlFor={`${option.id}`} className="cursor-pointer">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
