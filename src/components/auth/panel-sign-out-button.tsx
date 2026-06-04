"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type PanelSignOutButtonProps = {
  callbackUrl: string;
  variant?: "default" | "outline" | "ghost";
};

export function PanelSignOutButton({
  callbackUrl,
  variant = "outline",
}: PanelSignOutButtonProps) {
  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      className="gap-2"
      onClick={() => signOut({ callbackUrl })}
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </Button>
  );
}
