"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { normalizeOrderItemImage } from "@/lib/catalog-images";
import { useAuthStore } from "@/stores/auth-store";

export default function OrdersPage() {
  const orders = useAuthStore((s) => s.user?.orders ?? []);

  return (
    <div>
      <h1 className="font-serif text-2xl mb-6">Orders</h1>
      {orders.length === 0 ? (
        <div className="py-12 text-center border">
          <p className="text-muted-foreground">You haven&apos;t placed any orders yet.</p>
          <Button variant="luxury" className="mt-6" asChild>
            <Link href="/collections/new-arrivals">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {order.status}
                </Badge>
              </div>
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center mb-3 last:mb-0">
                  <div className="relative h-16 w-14 bg-secondary overflow-hidden shrink-0">
                    <Image
                      src={normalizeOrderItemImage(item)}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.color} / {item.size} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
              <p className="mt-4 text-sm font-semibold text-right">
                Total: {formatPrice(order.total)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
