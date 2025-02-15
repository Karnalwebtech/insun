import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Control,
  Controller,
  FieldErrors,
  Path,
  FieldValues,
} from "react-hook-form";

// Ensure T extends FieldValues, which is the expected type for form data
interface InputFieldProps<T extends FieldValues> {
  control: Control<T>; // The form control
  errors: FieldErrors<T>; // The form errors
  name: Path<T>; // Ensure name is a valid path in T
  label: string; // Label for the field
  type?: string; // Optional type for the input (default: "text")
  inputStyle?: string; // Optional additional class for the input
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Optional onChange handler
  maxLength?: number; // Optional maxLength for the input
  disabled_path?: boolean; // Optional disabled state
  required?: boolean; // Optional required state
}

const InputField = <T extends FieldValues>({
  control,
  errors,
  name,
  label,
  type = "text",
  inputStyle,
  handleInputChange,
  maxLength,
  disabled_path = false,
  required = true,
}: InputFieldProps<T>) => {
  let errorMessage: string | undefined;

  // Check if name contains a dot for nested errors
  if (name.includes(".")) {
    const nameParts = name.split(".");
    const parentKey = nameParts[0]; // e.g., 'shipping_address'
    const childKey = nameParts[1]; // e.g., 'city'

    // Check if the parent key exists in errors
    const parentErrors = errors[parentKey] as FieldErrors<T>;
    if (parentErrors && parentErrors[childKey]) {
      errorMessage = (parentErrors[childKey] as { message?: string }).message;
    }
  } else {
    // Accessing direct errors
    errorMessage = (errors[name] as { message?: string })?.message;
  }

  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div>
            <Input
              placeholder={required?label:`${label} (optional..)`}
              type={type}
              className={inputStyle}
              disabled={disabled_path}
              {...field}
              onChange={(e) => {
                // If there's an onChange handler, call it
                handleInputChange?.(e);
                field.onChange(e); // Ensure react-hook-form's onChange is called too
              }}
              maxLength={maxLength}
              value={field.value ?? ""} // Ensure a fallback empty string for undefined value
            />
            {errorMessage && (
              <p className="text-red-600 text-s pt-[3px]">{errorMessage}</p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default InputField;
