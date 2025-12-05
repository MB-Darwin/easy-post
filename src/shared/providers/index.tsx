// src/shared/providers/index.tsx
"use client";

import { NextIntlClientProvider } from "next-intl";
import { ReactQueryProvider } from "./react-query-provider";
import { CompanyProvider } from "@/entities/company/providers/company-provider";
import { type Company } from "@/entities/company/schema/company.schema";
import Preloader from "@/shared/components/Preloader"; // 1. IMPORT THE PRELOADER
import React from "react";

export default function RootProvider({
  children,
  company,
}: {
  children: React.ReactNode;
  company: Company | null;
}) {
  return (
    // 2. WRAP EVERYTHING IN THE PRELOADER
    <NextIntlClientProvider>
    <Preloader>
      {/* The Preloader component will be displayed as a full-screen overlay 
        while all these client-side providers are initializing.
        The actual content (children) is mounted behind the loader. 
      */}
      

        <ReactQueryProvider>
          <CompanyProvider company={company}>{children}</CompanyProvider>
        </ReactQueryProvider>
    </Preloader>
    </NextIntlClientProvider>
  );
}
