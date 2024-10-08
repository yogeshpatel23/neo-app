"use client";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useFormState } from "react-dom";
import { registerUserAction } from "@/app/action";
import SubmitButton from "../SubmitButton";

const RegisterForm = () => {
  const [formState, formAction] = useFormState(registerUserAction, {
    errors: {},
  });
  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="Your Name" />
        <span className="text-red-500 text-sm">{formState.errors?.name}</span>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" placeholder="Your email" />
        <span className="text-red-500 text-sm">{formState.errors?.email}</span>
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
        />
        <span className="text-red-500 text-sm">
          {formState.errors?.password}
        </span>
      </div>
      <div>
        <Label htmlFor="cpassword">Confrim Password</Label>
        <Input
          type="password"
          id="cpassword"
          name="cpassword"
          placeholder="ReEnter Password"
        />
        <span className="text-red-500 text-sm">
          {formState.errors?.cpassword}
        </span>
      </div>
      <SubmitButton className="w-full" text="Register" />
    </form>
  );
};

export default RegisterForm;
