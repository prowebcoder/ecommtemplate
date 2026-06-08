"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { StarRatingInput } from "@/components/shared/star-rating-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ProductReview } from "@/types/review";
import { cn } from "@/lib/utils";

type SaveStatus = "idle" | "saving" | "saved" | "error";

type ProductReviewFormProps = {
  productId: string;
  productHandle?: string;
  initialReview?: ProductReview | null;
  onSaved?: (review: ProductReview) => void;
};

export function ProductReviewForm({
  productId,
  productHandle,
  initialReview,
  onSaved,
}: ProductReviewFormProps) {
  const router = useRouter();
  const { status } = useSession();
  const [rating, setRating] = useState(initialReview?.rating ?? 0);
  const [title, setTitle] = useState(initialReview?.title ?? "");
  const [body, setBody] = useState(initialReview?.body ?? "");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef(
    JSON.stringify({
      rating: initialReview?.rating ?? 0,
      title: initialReview?.title ?? "",
      body: initialReview?.body ?? "",
    })
  );

  const saveReview = useCallback(
    async (payload: { rating: number; title: string; body: string }) => {
      if (payload.rating < 1 || payload.body.trim().length < 10) return;

      const snapshot = JSON.stringify(payload);
      if (snapshot === lastSavedRef.current) return;

      setSaveStatus("saving");
      setError("");

      try {
        const res = await fetch(`/api/products/${productId}/reviews`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating: payload.rating,
            title: payload.title.trim() || undefined,
            body: payload.body.trim(),
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error ?? "Failed to save review");
        }
        lastSavedRef.current = snapshot;
        setSaveStatus("saved");
        onSaved?.(data as ProductReview);
        router.refresh();
      } catch (err) {
        setSaveStatus("error");
        setError(err instanceof Error ? err.message : "Failed to save review");
      }
    },
    [productId, onSaved, router]
  );

  const scheduleSave = useCallback(
    (nextRating: number, nextTitle: string, nextBody: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        void saveReview({ rating: nextRating, title: nextTitle, body: nextBody });
      }, 1200);
    },
    [saveReview]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="rounded-sm border border-border/70 bg-card/40 p-6 animate-pulse">
        <div className="h-4 w-32 bg-secondary rounded" />
        <div className="h-20 w-full bg-secondary rounded mt-4" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="rounded-sm border border-dashed border-border/80 bg-secondary/20 p-6 md:p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Sign in to share your experience with this product.
        </p>
        <Button variant="luxury" className="mt-4" asChild>
          <Link
            href={`/account/login?callbackUrl=${encodeURIComponent(
              productHandle ? `/products/${productHandle}#reviews` : "/"
            )}`}
          >
            Sign in to review
          </Link>
        </Button>
      </div>
    );
  }

  const canAutoSave = rating >= 1 && body.trim().length >= 10;

  return (
    <form
      className="rounded-sm border border-border/70 bg-card/40 p-5 md:p-6 space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (debounceRef.current) clearTimeout(debounceRef.current);
        void saveReview({ rating, title, body });
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-sm uppercase tracking-[0.15em]">
            {initialReview ? "Update your review" : "Write a review"}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Your review saves automatically as you write.
          </p>
        </div>
        <span
          className={cn(
            "text-[11px] font-medium uppercase tracking-wider",
            saveStatus === "saving" && "text-muted-foreground",
            saveStatus === "saved" && "text-emerald-700",
            saveStatus === "error" && "text-destructive"
          )}
        >
          {saveStatus === "saving" && "Saving…"}
          {saveStatus === "saved" && "Saved"}
          {saveStatus === "error" && "Save failed"}
        </span>
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
          Your rating
        </Label>
        <StarRatingInput
          value={rating}
          onChange={(next) => {
            setRating(next);
            scheduleSave(next, title, body);
          }}
          size="lg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-title" className="text-xs uppercase tracking-wider text-muted-foreground">
          Headline <span className="normal-case tracking-normal">(optional)</span>
        </Label>
        <Input
          id="review-title"
          value={title}
          maxLength={120}
          placeholder="Summarize your experience"
          onChange={(e) => {
            const next = e.target.value;
            setTitle(next);
            scheduleSave(rating, next, body);
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-body" className="text-xs uppercase tracking-wider text-muted-foreground">
          Your review
        </Label>
        <Textarea
          id="review-body"
          value={body}
          rows={4}
          maxLength={2000}
          placeholder="What did you like or dislike? How was the fit and quality?"
          onChange={(e) => {
            const next = e.target.value;
            setBody(next);
            scheduleSave(rating, title, next);
          }}
        />
        <p className="text-[11px] text-muted-foreground text-right">
          {body.length}/2000 · min. 10 characters
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" variant="luxury" disabled={!canAutoSave || saveStatus === "saving"}>
        {saveStatus === "saving" ? "Saving…" : initialReview ? "Save changes" : "Publish review"}
      </Button>
    </form>
  );
}
