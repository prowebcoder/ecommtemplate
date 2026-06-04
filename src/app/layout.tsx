import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { StoreShell } from "@/components/layout/store-shell";
import { AppProviders } from "@/providers/app-providers";
import { buildMetadata } from "@/lib/seo";
import { organizationJsonLd } from "@/lib/structured-data";
import { SITE_NAME } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = buildMetadata({
  title: SITE_NAME,
  description:
    "Premium fashion essentials for men, women, and kids. Shop curated collections with timeless style.",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <AppProviders>
          <StoreShell>{children}</StoreShell>
        </AppProviders>
      </body>
    </html>
  );
}
