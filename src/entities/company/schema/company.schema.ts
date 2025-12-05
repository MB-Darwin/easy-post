import { createdAt, createTable, id, updatedAt } from "@/shared/utils";
import { index } from "drizzle-orm/pg-core";

/**
 * Company table schema
 * Stores company/tenant information from Genuka
 */
export const company = createTable(
  "company",
  (d) => ({
    id: d.text("id").primaryKey().notNull(),
    name: d.text("name").notNull(),
    handle: d.text("handle"),
    description: d.text("description"),
    logoUrl: d.text("logo_url"),
    phone: d.text("phone"),

    isFirstLogin: d.boolean("is_First_Login").default(true),

    // OAuth tokens
    accessToken: d.text("access_token"),
    refreshToken: d.text("refresh_token"),
    tokenExpiresAt: d.timestamp("token_expires_at"),

    // Additional metadata from Genuka API
    metadata: d.jsonb("metadata").$type<Record<string, unknown>>(),

    // Timestamps
    createdAt,
    updatedAt,
  }),
  (table) => [
    index("company_handle_idx").on(table.handle),
    index("company_name_idx").on(table.name),
  ]
);

export type CompanySelect = typeof company.$inferSelect;
export type CompanyInsert = typeof company.$inferInsert;
export type CompanyUpdate = Partial<CompanyInsert>;

export type Company = CompanySelect;
export type NewCompany = CompanyInsert;
