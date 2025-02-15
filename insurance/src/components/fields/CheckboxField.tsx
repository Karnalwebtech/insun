import React from 'react';
import { Control, Controller, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

interface CheckboxFieldProps<T extends FieldValues> {
    control: Control<T>;
    error: FieldErrors<T>;
    name: Path<T>;
    label: string;
}

const CheckboxField = <T extends FieldValues>({
    control,
    error,
    name,
    label
}: CheckboxFieldProps<T>) => {
    return (
        <div className="flex gap-2 items-center">
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <>
                        <Checkbox id={name} checked={field.value} onCheckedChange={field.onChange} />
                        <Label htmlFor={name}>{label}</Label>
                    </>
                )}
            />
            {error[name] && <p className="text-red-500 text-sm">{error[name]?.message as string}</p>}
        </div>
    );
}

export default CheckboxField;
