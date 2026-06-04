"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { normalizeOrderItemImage } from "@/lib/catalog-images";
import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types/user";

const schema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  address: z.string().min(5),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(5),
  phone: z.string().min(10),
});

type FormData = z.infer<typeof schema>;

function generateOrderNumber() {
  return `VL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, getSubtotal, getShipping, getTotal, clearCart, couponDiscount } =
    useCartStore();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addOrder = useAuthStore((s) => s.addOrder);
  const addAddress = useAuthStore((s) => s.addAddress);

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const total = getTotal();
  const discount = subtotal * couponDiscount;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (user) {
      const defaultAddr = user.addresses.find((a) => a.isDefault);
      reset({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone ?? "",
        address: defaultAddr?.line1 ?? "",
        city: defaultAddr?.city ?? "",
        state: defaultAddr?.state ?? "",
        postalCode: defaultAddr?.postalCode ?? "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: FormData) => {
    if (!isAuthenticated) {
      router.push(`/account/login?redirect=${encodeURIComponent("/checkout")}`);
      return;
    }

    await new Promise((r) => setTimeout(r, 1200));

    const order: Order = {
      id: `order-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      status: "confirmed",
      createdAt: new Date().toISOString(),
      items: items.map((item) => ({
        id: item.id,
        handle: item.handle,
        title: item.title,
        image: normalizeOrderItemImage(item),
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color,
      })),
      subtotal,
      shipping,
      total,
    };

    addOrder(order);

    addAddress({
      firstName: data.firstName,
      lastName: data.lastName,
      line1: data.address,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: "India",
      phone: data.phone,
      isDefault: !user?.addresses.length,
    });

    clearCart();
    router.push("/account/orders");
  };

  if (!items.length) {
    return (
      <p className="text-muted-foreground py-12 text-center">
        Your bag is empty.{" "}
        <Link href="/collections/new-arrivals" className="underline">
          Continue shopping
        </Link>
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-12 lg:grid-cols-2">
      {!isAuthenticated && (
        <div className="lg:col-span-2 rounded-sm border bg-secondary/50 px-4 py-3 text-sm">
          <Link href="/account/login?redirect=%2Fcheckout" className="font-medium underline">
            Sign in
          </Link>{" "}
          to save your order to your account, or continue below as a guest (order won&apos;t be
          saved until you sign in before placing).
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h2 className="font-serif text-xl mb-4">Contact</h2>
          <Label htmlFor="checkout-email">Email</Label>
          <Input id="checkout-email" type="email" className="mt-1.5" {...register("email")} />
          {errors.email && (
            <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <h2 className="font-serif text-xl mb-4">Shipping Address</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" className="mt-1.5" {...register("firstName")} />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" className="mt-1.5" {...register("lastName")} />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" className="mt-1.5" {...register("address")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" className="mt-1.5" {...register("city")} />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" className="mt-1.5" {...register("state")} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postalCode">PIN Code</Label>
                <Input id="postalCode" className="mt-1.5" {...register("postalCode")} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" className="mt-1.5" {...register("phone")} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:sticky lg:top-24 h-fit border p-6 space-y-4">
        <h2 className="font-serif text-xl">Order Summary</h2>
        <ul className="space-y-3 max-h-60 overflow-y-auto">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between text-sm gap-4">
              <span className="line-clamp-1">
                {item.title} × {item.quantity}
              </span>
              <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <Separator />
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-700">
              <span>Discount</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-2">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
        <Button type="submit" variant="luxury" className="w-full" disabled={isSubmitting}>
          {isSubmitting
            ? "Processing..."
            : isAuthenticated
              ? "Place Order"
              : "Sign In to Place Order"}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Demo checkout — no real payment processed
        </p>
      </div>
    </form>
  );
}
