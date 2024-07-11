"use server";

import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { registerSchema } from "@/validation/register";
import { redirect } from "next/navigation";

export async function registerUserAction(prevState: any, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const validatedFields = registerSchema.safeParse(data);
    if (!validatedFields.success) {
      return {
        errors: {
          name: validatedFields.error.flatten().fieldErrors.name?.[0],
          email: validatedFields.error.flatten().fieldErrors.email?.[0],
          password: validatedFields.error.flatten().fieldErrors.password?.[0],
          cpassword: validatedFields.error.flatten().fieldErrors.cpassword?.[0],
        },
      };
    }

    await dbConnect();
    const user = await User.findOne({ email: validatedFields.data.email });
    if (user) {
      return {
        errors: {
          email: "This email is already registred",
        },
      };
    }
    await User.create(validatedFields.data);
  } catch (error) {
    console.log(error);
    console.log(typeof error);
    return {
      errors: {},
    };
  }
  redirect("/login");
}
