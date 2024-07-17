"use client";
import { IAccount } from "@/models/Account";
import React, { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
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
import {
  FingerPrintIcon,
  PencilIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import DeleteAccountForm from "./DeleteAccountForm";

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

  let isValid =
    account.accessToken != "" && account.tokenExp === new Date().toDateString();

  return (
    <div className="space-y-4 mt-4">
      <div className="rounded-lg w-72 border-2 bg-gray-800">
        <div className="p-4 border-b-2 border-white/50">
          <h2>Kotak Neo</h2>
        </div>
        <div className="p-4">
          <p>App Id : {account.appId}</p>
          <p>Mobile : {account.mobile}</p>
          <div className="flex justify-center items-center pt-4">
            <Link
              href={isValid ? `/terminal/${account._id}` : "#"}
              className={`${buttonVariants({
                size: "sm",
                variant: "outline",
              })} p-2 mr-2 sm:mr-4 ${
                isValid ? "text-green-500" : "text-red-500 cursor-not-allowed"
              } `}
            >
              <PlayIcon className="size-4" />
            </Link>
          </div>
        </div>
        {/* <pre>{JSON.stringify(account, null, 2)}</pre> */}
        <div className="p-4 border-t-2 border-white/50 flex gap-4">
          <Button onClick={handleLogin} variant="outline">
            <FingerPrintIcon className="text-blue-800 size-4 mr-2" /> Login
          </Button>
          <Link
            href={`/account/edit/${account._id}`}
            className={`${buttonVariants({
              size: "sm",
              variant: "outline",
            })} flex items-center justify-center`}
          >
            <PencilIcon className="size-4 mr-2" />
            Edit
          </Link>
          <DeleteAccountForm id={account._id} />
        </div>
        <Dialog open={showOTPInput} onOpenChange={setShowOTPInput}>
          <DialogContent className="w-48">
            <DialogHeader>
              <DialogTitle>Enter OTP</DialogTitle>
            </DialogHeader>
            <DialogDescription></DialogDescription>
            <div className="flex justify-center">
              <InputOTP
                maxLength={4}
                value={otp}
                onChange={(val) => setOtp(val)}
              >
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
    </div>
  );
};

export default AccountCard;
