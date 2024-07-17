"use client";
import { IAccount } from "@/models/Account";
import React from "react";
import SubmitButton from "../SubmitButton";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useFormState } from "react-dom";
import { editAccount } from "@/app/action";

const EditAccountForm = ({
  account,
  id,
}: {
  account: IAccount;
  id: string;
}) => {
  const [formState, formAction] = useFormState(editAccount, null);
  return (
    <form action={formAction} className="space-y-4">
      <Input type="hidden" name="userId" value={account.userId} />
      <Input type="hidden" name="id" value={id} />
      <div>
        <Label htmlFor="appKey">App Key</Label>
        <Input
          id="appKey"
          name="appKey"
          defaultValue={account.appKey}
          placeholder="name"
        />
        <span className="text-red-500 text-sm">
          {formState?.errors?.appKey?.[0]}
        </span>
      </div>
      <div>
        <Label htmlFor="appSecret">App Secret</Label>
        <Input
          id="appSecret"
          name="appSecret"
          defaultValue={account.appSecret}
          placeholder="name"
        />
        <span className="text-red-500 text-sm">
          {formState?.errors?.appSecret?.[0]}
        </span>
      </div>
      <div>
        <Label htmlFor="appId">Api Id</Label>
        <Input
          id="appId"
          name="appId"
          defaultValue={account.appId}
          placeholder="name"
        />
        <span className="text-red-500 text-sm">
          {formState?.errors?.appId?.[0]}
        </span>
      </div>
      <div>
        <Label htmlFor="appPass">Api Pass </Label>
        <Input
          id="appPass"
          name="appPass"
          defaultValue={account.appPass}
          placeholder="name"
        />
        <span className="text-red-500 text-sm">
          {formState?.errors?.appPass?.[0]}
        </span>
      </div>
      <div>
        <Label htmlFor="mobile">
          Mobile <span className="text-xs">(with Contry code)</span>{" "}
        </Label>
        <Input
          id="mobile"
          name="mobile"
          defaultValue={account.mobile}
          placeholder="name"
        />
        <span className="text-red-500 text-sm">
          {formState?.errors?.mobile?.[0]}
        </span>
      </div>
      <div>
        <Label htmlFor="password">Passwrod</Label>
        <Input
          id="password"
          name="password"
          defaultValue={account.password}
          placeholder="Passwrod"
        />
        <span className="text-red-500 text-sm">
          {formState?.errors?.password?.[0]}
        </span>
      </div>

      <div className="text-right">
        <SubmitButton text="Update" />
      </div>
    </form>
  );
};

export default EditAccountForm;
