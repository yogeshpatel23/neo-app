"use client";

import { FormEvent, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [isLogging, setIsLogging] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLogging(true);
    const email = emailInputRef.current?.value;
    const password = passwordInputRef.current?.value;
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.ok) {
      router.push("/dashboard");
    } else {
      if (res?.status === 401) {
        alert("invalid email or password");
      } else {
        alert(res?.error);
      }
    }

    setIsLogging(false);
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input ref={emailInputRef} placeholder="Registed email" required />
      </div>
      <div>
        <Label htmlFor="password">Email</Label>
        <Input
          ref={passwordInputRef}
          type="password"
          placeholder="Password"
          required
        />
      </div>
      <Button className="w-full">{isLogging ? "Logging In.." : "Login"}</Button>
    </form>
  );
};

export default LoginForm;
