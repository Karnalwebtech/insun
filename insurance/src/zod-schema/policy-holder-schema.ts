import { z } from "zod";
import { AddressSchema } from "./address-schema";

export const PolicyHolderSchema = z.object({
  userId: z.string({ required_error: "User ID is required" }),
  firstName: z.string({ required_error: "First name is required" }),
  middleName: z.string().optional(),
  lastName: z.string({ required_error: "Last name is required" }),
  address: AddressSchema,
  phone: z.string({ required_error: "Phone number is required" }),
  alternatePhone: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }),
  dateOfBirth: z.date({ required_error: "Date of birth is required" }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required",
  }),
  nationality: z.string().optional(),
  bloodType: z
    .enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])
    .optional(),
  healthConditions: z.array(z.string()).optional(),
  disabilityStatus: z.boolean().optional(),
  languagesSpoken: z.array(z.string()).optional(),
  hobbies: z.array(z.string()).optional(),
  emergencyContact: z.object({
    name: z.string({ required_error: "Emergency contact name is required" }),
    relationship: z.string({ required_error: "Relationship is required" }),
    phone: z.string({ required_error: "Emergency contact phone is required" }),
  }),
  preferredCommunication: z.enum(["email", "phone", "text"], {
    required_error: "Preferred communication is required",
  }),
  occupation: z.string().optional(),
  policyHistory: z.array(z.string()),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"], {
    required_error: "Marital status is required",
  }),
  insuranceTypes: z.array(z.enum(["health", "life", "home", "auto"]), {
    required_error: "At least one insurance type is required",
  }),
  memberId: z.string({ required_error: "Member ID is required" }),
  consentToTerms: z.boolean({ required_error: "Consent to terms is required" }),
  paymentMethod: z
    .enum(["credit_card", "debit_card", "bank_transfer", "cash"])
    .optional(),
  socialMediaProfiles: z.array(
    z.object({
      platform: z.enum(["facebook", "twitter", "linkedin", "instagram"], {
        required_error: "Social media platform is required",
      }),
      url: z.string().url({ message: "Invalid URL format" }),
    })
  ),
  claimsHistory: z.array(z.string()),
  notes: z.string().optional(),
});

export type IPolicyHolder = z.infer<typeof PolicyHolderSchema>;
