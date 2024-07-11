import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center pt-24">
      <h2 className="text-3xl mb-6">Sign Up</h2>
      <div className="w-96 bg-gray-800 p-4">
        <RegisterForm />
      </div>
      <p className="text-sm text-white/40 mt-4">
        Have an account ?
        <Link href="/login" className="px-4 text-blue-500">
          Log In
        </Link>{" "}
      </p>
    </div>
  );
}
