"use client";
import { IAccount } from "@/models/Account";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { getAccessToken } from "@/app/action";

const AccountCard = ({ account }: { account: IAccount }) => {
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOtp] = useState("");

  async function handleLogin() {
    // if (await getAccessToken(account)) {
    //   setShowOTPInput(true);
    // }
    setShowOTPInput(true);
  }

  async function verifyOTP() {
    console.log(otp);
    setOtp("");
    setShowOTPInput(false);
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg border-2 bg-gray-800">
        <pre>{JSON.stringify(account, null, 2)}</pre>
      </div>
      <div>
        <Button onClick={handleLogin} variant="outline">
          Login
        </Button>
      </div>
      <Dialog open={showOTPInput} onOpenChange={setShowOTPInput}>
        <DialogContent className="w-48">
          <DialogHeader>
            <DialogTitle>Enter OTP</DialogTitle>
          </DialogHeader>
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
