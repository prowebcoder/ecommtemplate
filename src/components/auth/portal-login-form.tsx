"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import type { UserRole } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

type PortalLoginFormProps = {
  requiredRole: Extract<UserRole, "SUPER_ADMIN" | "VENDOR">;
  defaultCallbackUrl: string;
  wrongRoleMessage: string;
};

export function PortalLoginForm({
  requiredRole,
  defaultCallbackUrl,
  wrongRoleMessage,
}: PortalLoginFormProps) {
  const searchParams = useSearchParams();
  const [authError, setAuthError] = useState("");
  const callbackUrl = searchParams.get("callbackUrl") ?? defaultCallbackUrl;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setAuthError("");
    const result = await signIn("credentials", {
      email: data.email.trim().toLowerCase(),
      password: data.password,
      redirect: false,
    });
    if (result?.error) {
      setAuthError("Invalid email or password");
      return;
    }
    if (!result?.ok) {
      setAuthError("Sign in failed. Please try again.");
      return;
    }

    const sessionRes = await fetch("/api/auth/session");
    const session = (await sessionRes.json()) as { user?: { role?: UserRole } };
    if (session.user?.role !== requiredRole) {
      await signOut({ redirect: false });
      setAuthError(wrongRoleMessage);
      return;
    }

    window.location.href = callbackUrl;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {authError && (
        <p className="rounded-sm border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {authError}
        </p>
      )}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" className="mt-1.5" {...register("email")} />
        {errors.email && (
          <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          className="mt-1.5"
          {...register("password")}
        />
        {errors.password && (
          <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>
      <Button type="submit" variant="luxury" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">
          Back to storefront
        </Link>
      </p>
    </form>
  );
}
