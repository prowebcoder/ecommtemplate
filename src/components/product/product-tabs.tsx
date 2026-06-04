import type { Product } from "@/types/product";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type ProductTabsProps = {
  product: Product;
};

export function ProductTabs({ product }: ProductTabsProps) {
  const sections = [
    { title: "Description", content: product.description },
    { title: "Materials", content: product.materials },
    { title: "Care Instructions", content: product.careInstructions },
    { title: "Shipping", content: product.shippingInfo },
    { title: "Returns", content: product.returnPolicy },
  ];

  return (
    <Accordion type="single" collapsible className="w-full" defaultValue="Description">
      {sections.map((section) => (
        <AccordionItem key={section.title} value={section.title}>
          <AccordionTrigger className="text-sm font-semibold uppercase tracking-widest">
            {section.title}
          </AccordionTrigger>
          <AccordionContent>{section.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
