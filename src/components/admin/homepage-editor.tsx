"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/admin-fetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type HeroData = {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl: string;
};

export function HomepageEditor({ initial }: { initial: HeroData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="max-w-xl space-y-4 border bg-background p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        try {
          await adminFetch("/settings/homepage", {
            method: "PUT",
            body: JSON.stringify({
              title: fd.get("title"),
              subtitle: fd.get("subtitle"),
              ctaLabel: fd.get("ctaLabel"),
              ctaHref: fd.get("ctaHref"),
              imageUrl: fd.get("imageUrl"),
            }),
          });
          router.refresh();
        } catch (err) {
          alert(err instanceof Error ? err.message : "Failed");
        } finally {
          setLoading(false);
        }
      }}
    >
      <h2 className="font-medium">Homepage hero</h2>
      <div>
        <Label>Title</Label>
        <Input name="title" required defaultValue={initial.title} className="mt-1" />
      </div>
      <div>
        <Label>Subtitle</Label>
        <Input name="subtitle" defaultValue={initial.subtitle} className="mt-1" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>CTA label</Label>
          <Input name="ctaLabel" defaultValue={initial.ctaLabel} className="mt-1" />
        </div>
        <div>
          <Label>CTA link</Label>
          <Input name="ctaHref" defaultValue={initial.ctaHref} className="mt-1" />
        </div>
      </div>
      <div>
        <Label>Background image URL</Label>
        <Input name="imageUrl" type="url" required defaultValue={initial.imageUrl} className="mt-1" />
      </div>
      <Button type="submit" variant="luxury" disabled={loading}>
        Save homepage
      </Button>
    </form>
  );
}
