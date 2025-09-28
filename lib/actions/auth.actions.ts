"use server";

import { auth } from "@/lib/better-auth/auth";
import { inngest } from "@/lib/inngest/client";
import { headers } from "next/headers";

// Proper server action shape
export async function signUpWithEmail({
  email,
  password,
  fullName,
  country,
  investmentGoals,
  riskTolerance,
  preferredIndustry,
}: SignUpFormData) {
  try {
    const response = await auth.api.signUpEmail({
      body: { email, password, name: fullName },
    });

    if (response) {
      await inngest.send({
        name: "app/user.created",
        data: {
          email,
          name: fullName,
          country,
          investmentGoals,
          riskTolerance,
          preferredIndustry,
        },
      });
    }

    return { success: true, data: response };
  } catch (e) {
    console.error("Sign up failed", e);
    return { success: false, error: "Sign up failed" };
  }
}

export async function signInWithEmail({ email, password }: SignInFormData) {
  try {
    const response = await auth.api.signInEmail({ body: { email, password } });
    return { success: true, data: response };
  } catch (e) {
    console.error("Sign in failed", e);
    return { success: false, error: "Sign in failed" };
  }
}

export async function signOut() {
  try {
    await auth.api.signOut({ headers: await headers() });
    return { success: true };
  } catch (e) {
    console.error("Sign out failed", e);
    return { success: false, error: "Sign out failed" };
  }
}
