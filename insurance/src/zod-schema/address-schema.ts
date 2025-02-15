import {z} from "zod";
export const AddressSchema = z.object({
    address:z.string({required_error:"Address is required"}),
    city:z.string({required_error:"City is required"}),
    state:z.string({required_error:"State is required"}),
    country:z.string({required_error:"Country is required"}),
    pincode:z.string({required_error:"Pincode is required"})    
})