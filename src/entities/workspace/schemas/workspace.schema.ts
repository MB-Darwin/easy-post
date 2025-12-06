import { company } from "@/entities/company";
import { createTable } from "@/shared/utils";

export const workspace = createTable(
  "workspace",
  (d) => ({
    id: d.uuid("id").primaryKey().defaultRandom(),
    companyId: d
      .text("company_id")
      .notNull()
      .references(() => company.id, { onDelete: "cascade" }),
    name: d.text("name").notNull(),
    description: d.text("description"),
    createdAt: d.timestamp("created_at").defaultNow().notNull(),
    updatedAt: d.timestamp("updated_at").defaultNow().notNull(), // Add this
  }),
  (table) => []
);


export type Workspace = typeof workspace.$inferSelect;
export type NewWorkspace = typeof workspace.$inferInsert;