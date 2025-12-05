// src/app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/shared/styles/globals.css";
import { routing } from "@/shared/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import RootProvider from "@/shared/providers"; // Assuming this is RootProvider/index.tsx
import { getAuthenticatedCompany } from "@/shared/lib/auth";
import Preloader from "@/shared/components/Preloader";
import { ReactQueryProvider } from "@/shared/providers/react-query-provider";
import { CompanyProvider } from "@/entities/company/providers/company-provider";

export const metadata: Metadata = {
  // Your existing metadata setup
  icons: [
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
    { rel: "icon", url: "/favicon.ico" },
  ],
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Destructure locale directly from props.params
  const { locale } = await props.params;
  const company = await getAuthenticatedCompany(); // Server-side data fetch

  // Internationalization checks
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Pass children and server-fetched data to the client-side provider */}
        // 2. WRAP EVERYTHING IN THE PRELOADER
        <NextIntlClientProvider locale={locale}>
          <Preloader>
            {/* The Preloader component will be displayed as a full-screen overlay 
                while all these client-side providers are initializing.
                The actual content (children) is mounted behind the loader. 
              */}

            <ReactQueryProvider>
              <CompanyProvider company={company}>{props.children}</CompanyProvider>
            </ReactQueryProvider>
          </Preloader>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
