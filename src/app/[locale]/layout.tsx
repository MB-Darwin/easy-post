// src/app/layout.tsx
import "@/shared/styles/globals.css";
import { routing } from "@/shared/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getAuthenticatedCompany } from "@/shared/lib/auth";
import Preloader from "@/shared/components/preloader";
import { CompanyProvider } from "@/entities/company/providers/company-provider";
import { Toaster } from "sonner";
import { sfPro } from "@/shared/fonts";
import {
  ModalProvider,
  ModalRegistry,
  ReactQueryProvider,
} from "@/shared/providers";

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
