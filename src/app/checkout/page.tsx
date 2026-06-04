import { CheckoutForm } from "@/components/checkout/checkout-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Checkout",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="font-serif text-3xl mb-8">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
