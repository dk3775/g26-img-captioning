"use client";

import { signInAction, signInWithOTPAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

export function SignInForm({ message }: { message?: Message }) {
  const [useOTP, setUseOTP] = useState(false);

  return (
    <form className="flex flex-col w-full">
      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Sign in
      </h1>
      <p className="text-sm text-gray-300 mb-6">
        Don't have an account?{" "}
        <Link className="text-blue-400 hover:text-blue-300 font-medium" href="/sign-up">
          Sign up
        </Link>
      </p>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 mb-4">
          <Button
            type="button"
            variant={!useOTP ? "default" : "outline"}
            onClick={() => setUseOTP(false)}
          >
            Password
          </Button>
          <Button
            type="button"
            variant={useOTP ? "default" : "outline"}
            onClick={() => setUseOTP(true)}
          >
            Magic Link
          </Button>
        </div>

        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />

        {!useOTP && (
          <>
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                className="text-xs text-foreground underline"
                href="/forgot-password"
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              type="password"
              name="password"
              placeholder="Your password"
              required
            />
          </>
        )}

        <SubmitButton 
          pendingText={useOTP ? "Sending Magic Link..." : "Signing In..."} 
          formAction={async (formData: FormData) => { await (useOTP ? signInWithOTPAction : signInAction)(formData); }}
        >
          {useOTP ? "Send Magic Link" : "Sign in"}
        </SubmitButton>
        {message && <FormMessage message={message} />}
      </div>
    </form>
  );
}
