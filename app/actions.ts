"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString();
  const age = parseInt(formData.get("age")?.toString() || "0");
  const gender = formData.get("gender")?.toString();
  const occupation = formData.get("occupation")?.toString();
  const country = formData.get("country")?.toString();
  const interests = formData.getAll("interests").map(i => i.toString());
  const usagePurpose = formData.get("usage_purpose")?.toString();

  // Validate required fields
  if (!email || !password || !fullName || !age || !gender || 
      !occupation || !country || interests.length === 0 || !usagePurpose) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "All fields are required",
    );
  }

  // Validate interests length
  if (interests.length > 5) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Please select up to 5 interests",
    );
  }

  // Validate age
  if (age < 13 || age > 120) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Age must be between 13 and 120",
    );
  }

  // Validate occupation
  const validOccupations = ['educator', 'student', 'hobbyist', 'professional', 'other'];
  if (!validOccupations.includes(occupation.toLowerCase())) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Invalid occupation selected",
    );
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data: { user }, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (user) {
    // Update the users table with additional information
    const { error: profileError } = await supabase
      .from('users')
      .update({
        full_name: fullName,
        age,
        gender: gender.toLowerCase(),
        occupation: occupation.toLowerCase(),
        country: country.toLowerCase(),
        interests: interests.slice(0, 5), // Ensure max 5 interests
        usage_purpose: usagePurpose,
      })
      .eq('id', user.id);

    if (profileError) {
      console.error("Error updating profile:", profileError);
      // Continue with sign up even if profile update fails
      return encodedRedirect(
        "error",
        "/sign-up",
        "Account created but profile update failed. Please update your profile later."
      );
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/app");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/profile/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/profile/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/profile/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/profile/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/profile/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
