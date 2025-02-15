import React from "react";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DropdownOption = { key: string; value: string };

interface SelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  drop_down_selector: DropdownOption[];
  class_style?: string;
}

const SelectFields = <T extends FieldValues>({
  control,
  errors,
  name,
  label,
  placeholder = "Select one",
  drop_down_selector,
  class_style,
}: SelectFieldProps<T>) => {
  let errorMessage: string | undefined;

  // Check for nested errors
  if (name.includes(".")) {
    const nameParts = name.split(".");
    const parentKey = nameParts[0];
    const childKey = nameParts[1];
    const parentErrors = errors[parentKey] as FieldErrors<T>;
    if (parentErrors && parentErrors[childKey]) {
      errorMessage = (parentErrors[childKey] as { message?: string }).message;
    }
  } else {
    errorMessage = (errors[name] as { message?: string })?.message;
  }
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium">{label}</label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value || ""}>
            <SelectTrigger className={`w-full ${class_style || ""}`}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {drop_down_selector.map((option) => (
                <SelectItem key={option.key} value={option.key}>
                  {option.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

export default SelectFields;
