import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center pt-24">
      <h2 className="text-3xl mb-6">Sign In</h2>
      <div className="w-96 bg-gray-800 p-4">
        <LoginForm />
      </div>
      <p className="text-sm text-white/40 mt-4">
        Don&apos;t have an account ?
        <Link href="/register" className="px-4 text-blue-500">
          Sign Up
        </Link>{" "}
      </p>
    </div>
  );
}
