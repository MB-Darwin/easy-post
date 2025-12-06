import { company } from "@/entities/company";
import { createTable } from "@/shared/utils";
import { index } from "drizzle-orm/pg-core";

export const project = createTable("project", (d) => ({
  id: d.uuid("id").primaryKey().defaultRandom(),
  companyId: d.text("company_id")
    .notNull()
    .references(() => company.id, { onDelete: "cascade" }),
  name: d.text("name").notNull(),
  goals: d.text("goals"),
  description: d.text("description"),
  createdAt: d.timestamp("created_at").defaultNow().notNull(),
  updatedAt: d.timestamp("updated_at").defaultNow().notNull(),
}),
(table) => [
  index("project_company_id_idx").on(table.companyId),
  index("project_name_idx").on(table.name),
]);

export type Project = typeof project.$inferSelect;
export type NewProject = typeof project.$inferInsert;