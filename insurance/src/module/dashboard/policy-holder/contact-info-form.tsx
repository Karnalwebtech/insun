import type { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import InputField from "@/components/fields/InputField";
import LocationSelector from "@/components/fields/location-selector";
import SelectFields from "@/components/fields/select-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContactInfoProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
}

const ContactInfoForm = <T extends FieldValues>({
  control,
  errors,
}: ContactInfoProps<T>) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 ">
        <div className="space-y-2">
          <InputField
            control={control}
            errors={errors}
            label="First Name"
            name={"firstName" as Path<T>}
          />
          <InputField
            control={control}
            errors={errors}
            label="Middle Name"
            name={"middleName" as Path<T>}
            required={false}
          />
          <InputField
            control={control}
            errors={errors}
            label="Last Name"
            name={"lastName" as Path<T>}
          />
          <InputField
            control={control}
            errors={errors}
            label="Email"
            name={"email" as Path<T>}
            type="email"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              control={control}
              errors={errors}
              label="Phone"
              name={"phone" as Path<T>}
              type="number"
            />
            <InputField
              control={control}
              errors={errors}
              label="Alternate Phone"
              name={"alternatePhone" as Path<T>}
              type="number"
            />
          </div>
          <SelectFields
            control={control}
            errors={errors}
            label="Preferred Communication"
            name={"preferredCommunication" as Path<T>}
            drop_down_selector={[
              { key: "email", value: "Email" },
              { key: "phone", value: "Phone" },
              { key: "text", value: "Text" },
            ]}
          />
        </div>
        <div>
          <div className="grid grid-cols-2 gap-4 pb-2">
            <InputField
              control={control}
              errors={errors}
              label="Address"
              name={"address" as Path<T>}
            />
            <InputField
              control={control}
              errors={errors}
              label="Pin code"
              name={"pincode" as Path<T>}
            />
          </div>
          <LocationSelector onSelect={(location) => console.log(location)} />

        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoForm;
