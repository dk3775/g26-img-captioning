import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-black/30 p-8 rounded-2xl backdrop-blur-xl border border-gray-800 shadow-xl w-full max-w-md">
        <form className="flex flex-col w-full">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Reset Password</h1>
          <p className="text-sm text-gray-300 mb-6">
            Remember your password?{" "}
            <Link className="text-blue-400 hover:text-blue-300 font-medium" href="/sign-in">
              Sign in
            </Link>
          </p>
          <div className="flex flex-col gap-4">
            <Label htmlFor="email">Email</Label>
            <Input name="email" placeholder="you@example.com" required />
            <SubmitButton formAction={forgotPasswordAction}>
              Reset Password
            </SubmitButton>
            <FormMessage message={searchParams} />
          </div>
        </form>
        <SmtpMessage />
      </div>
    </div>
  );
}
