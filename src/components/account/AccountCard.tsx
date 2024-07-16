"use client";
import { IAccount } from "@/models/Account";
import React, { useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { getAccessToken, verifyToken } from "@/app/action";
import Link from "next/link";

const AccountCard = ({ account }: { account: IAccount }) => {
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOtp] = useState("");

  async function handleLogin() {
    if (await getAccessToken(account)) {
      setShowOTPInput(true);
    }
  }

  async function verifyOTP() {
    console.log(otp);
    await verifyToken(account._id, otp);
    setOtp("");
    setShowOTPInput(false);
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg border-2 bg-gray-800">
        <pre>{JSON.stringify(account, null, 2)}</pre>
      </div>
      <div className="flex gap-4">
        <Button onClick={handleLogin} variant="outline">
          Login
        </Button>
        <Link
          href="/terminal"
          className={buttonVariants({ variant: "outline" })}
        >
          Terminal
        </Link>
      </div>
      <Dialog open={showOTPInput} onOpenChange={setShowOTPInput}>
        <DialogContent className="w-48">
          <DialogHeader>
            <DialogTitle>Enter OTP</DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          <div className="flex justify-center">
            <InputOTP maxLength={4} value={otp} onChange={(val) => setOtp(val)}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <DialogFooter>
            <Button onClick={verifyOTP}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountCard;
