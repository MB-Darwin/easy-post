import { NextIntlClientProvider } from "next-intl";
import { ReactQueryProvider } from "./react-query-provider";

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextIntlClientProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </NextIntlClientProvider>
  );
}
