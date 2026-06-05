"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { normalizeOrderItemImage } from "@/lib/catalog-images";

type OrderItem = {
  id: string;
  productTitle: string;
  imageUrl: string | null;
  colorName: string | null;
  sizeLabel: string | null;
  quantity: number;
  unitPrice: { toString(): string } | number;
};

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: Date | string;
  total: { toString(): string } | number;
  items: OrderItem[];
  payments?: { provider: string; status: string }[];
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Confirmed",
  PAID: "Paid",
  FULFILLED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export function AccountOrdersList({
  orders,
  placed,
}: {
  orders: Order[];
  placed?: string;
}) {
  return (
    <div>
      <h1 className="font-serif text-2xl mb-6">Orders</h1>

      {placed && (
        <div className="mb-6 rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Thank you! Order <strong>{placed}</strong> has been placed successfully.
        </div>
      )}

      {orders.length === 0 ? (
        <div className="py-12 text-center border rounded-sm">
          <p className="text-muted-foreground">You haven&apos;t placed any orders yet.</p>
          <Button variant="luxury" className="mt-6" asChild>
            <Link href="/collections/new-arrivals">Start shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const payment = order.payments?.[0];
            const paymentLabel =
              payment?.provider === "COD"
                ? "Cash on delivery"
                : payment?.provider === "RAZORPAY"
                  ? "Paid online"
                  : null;

            return (
              <div key={order.id} className="border rounded-sm p-4 md:p-6 bg-card">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {paymentLabel && ` · ${paymentLabel}`}
                    </p>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {STATUS_LABELS[order.status] ?? order.status.toLowerCase()}
                  </Badge>
                </div>
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center mb-3 last:mb-0">
                    <div className="relative h-16 w-14 bg-secondary overflow-hidden shrink-0 rounded-sm">
                      <Image
                        src={normalizeOrderItemImage({
                          image: item.imageUrl ?? "",
                          handle: item.productTitle,
                        })}
                        alt={item.productTitle}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.productTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.colorName} / {item.sizeLabel} · Qty {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm shrink-0">
                      {formatPrice(Number(item.unitPrice) * item.quantity)}
                    </p>
                  </div>
                ))}
                <p className="mt-4 text-sm font-semibold text-right">
                  Total: {formatPrice(Number(order.total))}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
