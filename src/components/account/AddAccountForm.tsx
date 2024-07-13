"use client";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useFormState } from "react-dom";
import { addAccount } from "@/app/action";
import SubmitButton from "../SubmitButton";

const initialstate: { errors: any } = {
  errors: {},
};

const AddAccountForm = () => {
  const [formState, formAction] = useFormState(addAccount, initialstate);
  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="appKey">Api Key</Label>
        <Input type="text" id="appKey" name="appKey" placeholder="Api key" />
        <span className="text-red-500 text-xs">
          {formState?.errors?.appKey?.[0]}
        </span>
      </div>
      <div className="space-y-2">
        <Label htmlFor="appSecret">Api Secret</Label>
        <Input
          type="text"
          id="appSecret"
          name="appSecret"
          placeholder="Api Secret"
          required
        />
        <span className="text-red-500 text-xs">
          {formState?.errors?.appSecret?.[0]}
        </span>
      </div>
      <div className="space-y-2">
        <Label htmlFor="appId">Api UserId</Label>
        <Input
          type="text"
          id="appId"
          name="appId"
          placeholder="Api UserId"
          required
        />
        <span className="text-red-500 text-xs">
          {formState?.errors?.appId?.[0]}
        </span>
      </div>
      <div className="space-y-2">
        <Label htmlFor="appPass">Api Password</Label>
        <Input
          type="text"
          id="appPass"
          name="appPass"
          placeholder="Api Password"
          required
        />
        <span className="text-red-500 text-xs">
          {formState?.errors?.appPass?.[0]}
        </span>
      </div>
      <div className="space-y-2">
        <Label htmlFor="mobile">
          Mobile No <span className="text-xs">(with Contry code)</span>{" "}
        </Label>
        <Input
          type="text"
          id="mobile"
          name="mobile"
          placeholder="Mobile No"
          required
        />
        <span className="text-red-500 text-xs">
          {formState?.errors?.mobile?.[0]}
        </span>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          type="text"
          id="password"
          name="password"
          placeholder="Password"
          required
        />
        <span className="text-red-500 text-xs">
          {formState?.errors?.password?.[0]}
        </span>
      </div>
      <SubmitButton className="w-full" text="Add" />
      <span className="text-red-500 text-xs">{formState?.errors?.message}</span>
    </form>
  );
};

export default AddAccountForm;
