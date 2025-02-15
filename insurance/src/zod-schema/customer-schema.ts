import { z } from "zod";

export const CustomerSchema = z.object({
    fullname: z.string().min(2, "Full name is required"),
    policy_no: z.string().min(1, "Policy number is required"),
    phone: z.string().min(10, "Enter a valid phone number"),
    dop: z.string().min(1, "Date of policy is required"),
    dor: z.string().min(1, "Date of renewal is required"),
    issue_policy_year: z.string().min(1, "Issue policy year is required"),
    si: z.string().min(1, "Sum Insured (SI) is required"),
    amount: z.string().min(1, "Amount is required"),
    email: z.string().email("Invalid email format"),
    category:z.string().min(1, "At least one category is required"),
    healthConditions: z.string().min(1, "Health Condition is required"),
});
