"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputField from "@/components/fields/InputField";
import MultiSelectField from "@/components/fields/MultiSelectField";
import SelectFields from "@/components/fields/select-field";
import { CustomerSchema } from "@/zod-schema/customer-schema";
import { useState } from "react";
import FileUploader from "@/components/uploader/file-uploader";
import { useSession } from "next-auth/react";
import { encryptValue } from "@/utils/crypto";
import { useToast } from "@/hooks/use-toast";
import { GeneralBtn } from "@/components/buttons/general-btn";
import { useRouter } from "next/navigation";
// import  PersonalInfoForm  from "./personal-info-form";
type FormData = z.infer<typeof CustomerSchema>;
const insurancePaymentModes = [
  { key: "monthly", value: "Monthly" },
  { key: "quarterly", value: "Quarterly" },
  { key: "semi_annual", value: "Semi-Annual (Half-Yearly)" },
  { key: "annual", value: "Annual" },
  { key: "single_premium", value: "Single Premium" },
  { key: "pay_as_you_go", value: "Pay-As-You-Go" },
  { key: "lump_sum", value: "Lump Sum" },
  { key: "flexible", value: "Flexible Payment Plan" },
];


export default function CustomerForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { data: session } = useSession()
  const [addharCard, set_AddharCard] = useState<File[]>([]);
  const [panCard, set_PanCard] = useState<File[]>([]);
  const [document, set_Document] = useState<File[]>([]);
  const [profileImage, set_ProfileImage] = useState<File[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(CustomerSchema),
  });



  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    // const updatedData: ExtendedFormData = { ...data, addharCard, panCard, document, profileImage }
    for (const key of Object.keys(data) as Array<keyof typeof data>) {
      formData.append(key, data[key])
    }
    // ✅ Append file arrays correctly
    addharCard.forEach((file) => formData.append("addharCard", file));
    panCard.forEach((file) => formData.append("panCard", file));
    document.forEach((file) => formData.append("document", file));
    profileImage.forEach((file) => formData.append("profileImage", file));
    const sessionData = session?.user.email
    try {

      if (!session?.user?.email) {
        throw new Error("Session is missing or user email is undefined.");
      }
      setIsLoading(true)
      const token: string = await encryptValue(sessionData)
      const apiKey: string = await encryptValue(process.env.NEXT_PUBLIC_API_KEY!)
      const response = await fetch("http://localhost:9000/api/v1/add-customer", {
        method: "POST",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${token}`,
          "x-api-key": apiKey,
        },
        body: formData, // ✅ Send data properly
      });
      const result = await response.json();
      if (!response.ok) {
        toast({
          title: "Error",
          description: result.message || "An error occurred.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description:
        result.message,
      });
      router.push('/dashboard/customers')
    }
    catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    }
    finally {
      setIsLoading(false); // ✅ Hide loader after request
    }
    // Here you would typically send this data to your API
  };

  return (<>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="block md:flex gap-4 ">
        <Card className="w-[100%] md:w-[70%]">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <InputField
              control={control}
              errors={errors}
              label="Full name"
              name={"fullname"}
            />
            <InputField
              control={control}
              errors={errors}
              label="Policy no"
              name={"policy_no"}
            />
            <InputField
              control={control}
              errors={errors}
              label="Phone"
              name={"phone"}
              type="number"
            />
            <InputField
              control={control}
              errors={errors}
              label="Date of policy"
              name={"dop"}
              type="date"
            />
            <InputField
              control={control}
              errors={errors}
              label="Date of renewal"
              name={"dor"}
              type="date"
            />
            <InputField
              control={control}
              errors={errors}
              label="Issue policy Year"
              name={"issue_policy_year"}
              type="date"
            />
            <InputField
              control={control}
              errors={errors}
              label="S.I."
              name={"si"}
            />
            <InputField
              control={control}
              errors={errors}
              label="Amount"
              name={"amount"}
              type="number"
            />
            <InputField
              control={control}
              errors={errors}
              label="Email"
              name={"email"}
              type="email"
            />
            <MultiSelectField
              control={control}
              errors={errors}
              label="Category"
              name={"category"}
            />
            <SelectFields
              control={control}
              errors={errors}
              label="Health Conditions"
              name={"healthConditions"}
              drop_down_selector={insurancePaymentModes}
            />
          </CardContent>
        </Card>
        <div className="mt-4 md:mt-0 w-[100%] md:w-[30%] space-y-4">

          <FileUploader
            title="Customer Profile Photo"
            field="image"
            set_files={set_ProfileImage}
          />
          <FileUploader
            title="Addhar Card Photo"
            field="image"
            set_files={set_AddharCard}
          />
          <FileUploader
            title="Pan Card"
            field="image"
            set_files={set_PanCard}
          />
          <FileUploader
            title="Insurance Document PDF"
            field="application/pdf"
            set_files={set_Document}
          />
        </div>
      </div>
       <GeneralBtn type="submit" title="Submit" loader={isLoading} />
    </form>

  </>
  );
}
