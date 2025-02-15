"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";

import { PolicyHolderSchema } from "@/zod-schema/policy-holder-schema";
import ContactInfoForm from "./contact-info-form";
import InsuranceInfoForm from "./insurance-info-form";
import PersonalInfoForm from "./personal-info-form";
// import  PersonalInfoForm  from "./personal-info-form";
type FormData = z.infer<typeof PolicyHolderSchema>;

export default function PolicyHolderForm() {
  // const [socialMediaProfiles, setSocialMediaProfiles] = useState([
  //   { platform: "facebook", url: "" },
  // ]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(PolicyHolderSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log("click");
    console.log(data);
    // Here you would typically send this data to your API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <ContactInfoForm control={control} errors={errors} />
    <div className="grid grid-cols-2 gap-4">
    <InsuranceInfoForm control={control}
        errors={errors} />
      {/* <PersonalInfoForm/> */}
      <PersonalInfoForm control={control}
        errors={errors} />
    </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}
