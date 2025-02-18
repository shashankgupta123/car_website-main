import { z, ZodError } from "zod";

export const signupSchema = z.object({
    username: z
      .string({ required_error: "Name is Required" })
      .trim()
      .min(3, { message: "Name must be atleast 3 chars" })
      .max(255, { message: "Name must not be above 255 chars" }),
  
    email: z
      .string({ required_error: "Email is Required" })
      .trim()
      .email({ message: "Invalid Email address" })
      .min(3, { message: "Email must be atleast 3 chars" })
      .max(255, { message: "Email must not be above 255 chars" }),
  
    phone: z
      .string({ required_error: "Phone Number is Required" })
      .trim()
      .min(10, { message: "Phone must be atleast 10 chars" })
      .max(10, { message: "Phone must not be above 10 chars" }),
  
    password: z
      .string({ required_error: "Password is Required" })
      .min(7, { message: "Password must be atleast 7 chars" })
      .max(255, { message: "Password must not be above 255 chars" }),
  });
  
export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is Required" })
    .trim()
    .email({ message: "Invalid Email address" }),

  password: z
    .string({ required_error: "Password is Required" })
    .min(7, { message: "Password must be at least 7 characters" }),
});
