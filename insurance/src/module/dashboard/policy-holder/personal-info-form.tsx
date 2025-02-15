import type { Control, FieldErrors, FieldValues, Path } from "react-hook-form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import InputField from "@/components/fields/InputField"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import RadioGroupfield from "@/components/fields/RadioGroupfield"
import CheckboxField from "@/components/fields/CheckboxField"
import SelectFields from "@/components/fields/select-field"
// import MultiSelectField from "@/components/fields/MultiSelectField"
const bloodGroup = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const gender = ["Male", "Female", "Other"];
const maritalStatuses = ["single", "married", "divorced", "widowed"]
const paymentMethods = ["credit_card", "debit_card", "bank_transfer", "cash"]
// const socialMediaPlatforms = ["facebook", "twitter", "linkedin", "instagram"]
interface PersonalInfoProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
}
const PersonalInfoForm = <T extends FieldValues>({
  control,
  errors,
}: PersonalInfoProps<T>) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent >
        <div className="space-y-4">
          <InputField
            control={control}
            errors={errors}
            label="Nationality"
            name={"nationality" as Path<T>}
          />
          <RadioGroupfield
            control={control}
            errors={errors}
            name={"gender" as Path<T>}
            options={gender}
            label={"Gender"} />



          <div className="space-y-2">
            <Label htmlFor={"BloodType"} className="capitalize">Blood Type</Label>
            <RadioGroup className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3"
            //  value={selectedType} onValueChange={setSelectedType}
            >

              {bloodGroup.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <RadioGroupItem value={type} id={type} />
                  <Label htmlFor={type} className="capitalize">
                    {type}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          {/* <MultiSelectField
            control={control}
            errors={errors}
            label="Health Conditions"
            name={"healthConditions" as Path<T>}
          /> */}
          <SelectFields
            control={control}
            errors={errors}
            label="Health Conditions"
            name={"healthConditions" as Path<T>}
            drop_down_selector={[
              { key: "email", value: "Email" },
              { key: "phone", value: "Phone" },
              { key: "text", value: "Text" },
            ]}
          />
          <CheckboxField control={control}
            error={errors}
            label="Disability Status"
            name={"disabilityStatus" as Path<T>} />

          <InputField
            control={control}
            errors={errors}
            label="Languages Spoken"
            name={"languagesSpoken" as Path<T>}
          />
          <InputField
            control={control}
            errors={errors}
            label="Hobbies"
            name={"hobbies" as Path<T>}
          />
          <InputField
            control={control}
            errors={errors}
            label="Emergency Contact Name"
            name={"emergencyContactname" as Path<T>}
          />
          <InputField
            control={control}
            errors={errors}
            label="Emergency Contact Relationship"
            name={"emergencyContact.relationship" as Path<T>}
          />
          <InputField
            control={control}
            errors={errors}
            label="Occupation"
            name={"occupation" as Path<T>}
          />
          <InputField
            control={control}
            errors={errors}
            label="Occupation"
            name={"occupation" as Path<T>}
            type="date"
          />
          <RadioGroupfield
            control={control}
            errors={errors}
            name={"dateOfBirth" as Path<T>}
            options={maritalStatuses}
            label={"Date of Birth"} />

          <RadioGroupfield
            control={control}
            errors={errors}
            name={"paymentMethods" as Path<T>}
            options={paymentMethods}
            label={"Payment Methods"} />
        </div>
      </CardContent >
    </Card>
  )
}

export default PersonalInfoForm