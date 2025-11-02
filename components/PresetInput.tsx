// src/components/PresetInput.tsx
import React from 'react';

interface PresetInputProps {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  presets: string[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const PresetInput: React.FC<PresetInputProps> = ({
  label,
  name,
  value,
  placeholder,
  presets,
  onInputChange,
  onSelectChange,
}) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-brand-text mb-1">
        {label}
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={onInputChange}
          placeholder={placeholder}
          className="flex-1 min-w-0 w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-brand-primary focus:border-brand-primary"
        />
        <select
          name={name}
          value="" // Reset select to placeholder
          onChange={onSelectChange}
          className="w-full sm:w-auto bg-brand-bg border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-brand-primary focus:border-brand-primary"
          aria-label={`${label} preset`}
        >
          <option value="">-- Select Preset --</option>
          {presets.map((preset) => (
            <option key={preset} value={preset}>
              {preset}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PresetInput;
