import React from "react";

interface InputProps {
  id?: string;
  name?: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "time"
    | "textarea";
  placeholder?: string;
  value?: string | number;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  label?: string;
  className?: string;
  rows?: number;
  min?: string;
  step?: string;
}

export default function Input({
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  label,
  className = "",
  rows = 4,
  min,
  step,
}: InputProps) {
  const inputClasses = `
    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
    ${error ? "border-red-500" : "border-gray-300"} 
    ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          rows={rows}
          className={inputClasses}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          min={min}
          step={step}
          className={inputClasses}
        />
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
