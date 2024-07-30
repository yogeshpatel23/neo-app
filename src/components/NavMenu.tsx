"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] });

const NavMenu = () => {
  const { data: session } = useSession();
  return (
    <div className="fixed top-0 w-full py-4 h-16 border-b-2">
      <div className="container flex items-center justify-between">
        <div className="text-2xl">
          <span className="text-red-600 font-extrabold">VY</span>
          <span
            className={`${pacifico.className} text-blue-600 font-extrabold ml-1`}
          >
            Trade Pro
          </span>
        </div>
        <div className="space-x-4">
          {session ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Button
                className="font-bold"
                size="sm"
                onClick={() => {
                  signOut();
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Register
              </Link>
              <Link
                href="/login"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavMenu;
