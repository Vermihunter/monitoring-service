"use server";

import { SignUpData } from "./_types/SignUpData";
import { z } from "zod";
import { cookies } from "next/headers";
import { SignInData } from "./_types/SignInData";
import Monitor from "./_types/monitor";
import { updateMonitor } from "./_lib/api";

const schema = z
  .object({
    email: z.email("Please enter a valid email address"),
    fname: z.string().min(2, "First name must have at least 2 characters"),
    lname: z.string().min(2, "Last name must have at least 2 characters"),
    password: z.string().min(8, "Password must contain at least 8 characters"),
    passwordConfirm: z.string(),
    agreedToTerms: z.boolean(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    error: "Passwords do not match",
  });

export const handleSignUp = async (data: SignUpData) => {
  console.log("Submitted data:", data);

  if (!data.agreedToTerms) {
    return {
      status: "error",
      message: "You have to agree to the terms and conditions",
    };
  }

  const result = schema.safeParse(data);
  console.log(result.error);
  if (!result.success) {
    return {
      status: "error",
      message: result.error.issues[0].message,
    };
  }

  // Example API call
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

  if (res.status === "error") {
    return {
      status: "error",
      message: "Error Signing Up to our application!",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("jwt", res.token, {
    httpOnly: true,
    secure: true,
  });

  console.log(res);
  return {
    status: "success",
    redirect: "/monitor",
  };
};

export const handleSignIn = async (data: SignInData) => {
  //console.log("Submitted data:", data);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

  if (res.status === "fail") {
    return {
      status: res.status,
      message: res.message,
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("jwt", res.token, {
    httpOnly: true,
    secure: true,
  });

  return {
    status: "success",
    redirect: "/monitor",
  };
};

export const handleMonitorUpdate = async (id: string, data: Monitor) => {
  return await updateMonitor(id, data);
};
