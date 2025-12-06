"use client";

import { useEffect } from "react";
import { useCompanyStore } from "../store/company.store";
import { type Company } from "../schemas/company.schema";

interface CompanyProviderProps {
  company: Company | null;
  children: React.ReactNode;
}

export function CompanyProvider({ company, children }: CompanyProviderProps) {
  const setCompany = useCompanyStore((state) => state.setCompany);

  useEffect(() => {
    setCompany(company);
  }, [company, setCompany]);

  return <>{children}</>;
}
