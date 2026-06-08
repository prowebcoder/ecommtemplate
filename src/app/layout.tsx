import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { StoreShell } from "@/components/layout/store-shell";
import { AppProviders } from "@/providers/app-providers";
import { buildRootMetadata } from "@/lib/seo";
import { getSiteSeo } from "@/lib/site-seo";
import { organizationJsonLd } from "@/lib/structured-data";
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

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSiteSeo();
  return buildRootMetadata(seo);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const seo = await getSiteSeo();

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd(seo)),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <AppProviders>
          <StoreShell seo={seo}>{children}</StoreShell>
        </AppProviders>
      </body>
    </html>
  );
}
