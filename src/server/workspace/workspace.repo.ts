import { db } from "../../shared/db/index";
import { workspace, Workspace, NewWorkspace } from "@/shared/db/schemas";
import { eq } from "drizzle-orm";

export const WorkspaceRepo = {
  create(data: NewWorkspace): Promise<Workspace[]> {
    return db.insert(workspace).values(data).returning();
  },

  findById(id: string): Promise<Workspace[]> {
    return db.select().from(workspace).where(eq(workspace.id, id));
  },

  findByCompanyId(companyId: string): Promise<Workspace[]> {
    return db.select().from(workspace).where(eq(workspace.companyId, companyId));
  },

  update(id: string, data: Partial<NewWorkspace>): Promise<Workspace[]> {
  return db
    .update(workspace)
    .set(data)
    .where(eq(workspace.id, id))
    .returning(); // Drizzle renvoie un array des lignes mises à jour
},

    delete(id: string): Promise<Workspace[]> {
    return db
        .delete(workspace)
        .where(eq(workspace.id, id))
        .returning(); // renvoie les lignes supprimées
    }
};
