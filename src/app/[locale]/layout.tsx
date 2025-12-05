// src/app/layout.tsx

import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "@/shared/styles/globals.css";
import { routing } from "@/shared/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getAuthenticatedCompany } from "@/shared/lib/auth";
import Preloader from "@/shared/components/preloader";
import { CompanyProvider } from "@/entities/company/providers/company-provider";
import { Toaster } from "sonner";

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

import { sfPro } from "@/shared/fonts";
import {
  ModalProvider,
  ModalRegistry,
  ReactQueryProvider,
} from "@/shared/providers";

// ... imports

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const registry: ModalRegistry = {};

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
      <body className={`${sfPro.variable} antialiased`}>
        <NextIntlClientProvider locale={locale}>
          <Preloader>
            <ReactQueryProvider>
              <CompanyProvider company={company}>
                <Toaster />
                {props.children}
                <ModalProvider registry={registry} />
              </CompanyProvider>
            </ReactQueryProvider>
          </Preloader>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
