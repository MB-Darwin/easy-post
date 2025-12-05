import { create } from "zustand";
import { type Company } from "../schema/company.schema";

interface CompanyState {
  company: Company | null;
  setCompany: (company: Company | null) => void;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  company: null,
  setCompany: (company) => set({ company }),
}));
