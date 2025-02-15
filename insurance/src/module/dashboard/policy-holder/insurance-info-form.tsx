import type { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import InputField from "@/components/fields/InputField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RadioGroupfield from "@/components/fields/RadioGroupfield";

const insuranceTypes = ["health", "life", "auto", "home", "disability"];
interface InsuranceInfoFormProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
}
const InsuranceInfoForm = <T extends FieldValues>({
  control,
  errors,
}: InsuranceInfoFormProps<T>) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Insurance Information</CardTitle>
      </CardHeader>
      <CardContent >
        <div className="space-y-4">
          <InputField
            control={control}
            errors={errors}
            label="Member ID"
            name={"insuranceTypes" as Path<T>}
            required={false}
          />
          <RadioGroupfield control={control}
            errors={errors} name={"insuranceTypes" as Path<T>} options={insuranceTypes} label={"Insurance Types"} />

        </div>
      </CardContent>
    </Card>
  );
};

export default InsuranceInfoForm;
