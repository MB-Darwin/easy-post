import { NextIntlClientProvider } from "next-intl";
import { ReactQueryProvider } from "./react-query-provider";
import { CompanyProvider } from "@/entities/company/providers/company-provider";
import { type Company } from "@/entities/company/schema/company.schema";

export default function RootProvider({
  children,
  company,
}: {
  children: React.ReactNode;
  company: Company | null;
}) {
  return (
    <NextIntlClientProvider>
      <ReactQueryProvider>
        <CompanyProvider company={company}>{children}</CompanyProvider>
      </ReactQueryProvider>
    </NextIntlClientProvider>
  );
}
