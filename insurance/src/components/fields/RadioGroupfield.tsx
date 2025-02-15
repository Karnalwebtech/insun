import React from 'react'
import { Control, Controller, FieldErrors, FieldValues, Path } from 'react-hook-form'
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
interface RadioGroupfieldProps<T extends FieldValues> {
    control: Control<T>;
    errors: FieldErrors<T>;
    options: string[];
    name: Path<T>;
    label: string;
    lg?: number;
    md?: number;
}
const RadioGroupfield = <T extends FieldValues>({ control, errors, name, options, label, lg = 4, md = 3 }: RadioGroupfieldProps<T>) => {
    let errorMessage: string | undefined;
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
        <div className="space-y-2">
            <Label htmlFor={label} className="capitalize">
                {label}
            </Label>
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <RadioGroup className={`grid grid-cols-2 md:grid-cols-${md} lg:grid-cols-${lg} gap-3`}
                        value={field.value} // Use field.value from react-hook-form
                        onValueChange={field.onChange}
                    >
                        {options.map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                                <RadioGroupItem value={type} id={type} />
                                <Label htmlFor={type} className="capitalize">
                                    {type}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                )} />
            {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
        </div>
    )
}

export default RadioGroupfield