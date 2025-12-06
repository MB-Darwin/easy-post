import { db } from "../../shared/db/index";
import { project, Project, NewProject } from "@/shared/db/schemas";
import { eq } from "drizzle-orm";

export const ProjectRepo = {
  create(data: NewProject): Promise<Project[]> {
    return db.insert(project).values(data).returning();
  },

  findById(id: string): Promise<Project[]> {
    return db.select().from(project).where(eq(project.id, id));
  },

  findAll(): Promise<Project[]> {
    return db.select().from(project);
  },

  findByCompanyId(companyId: string): Promise<Project[]> {
    return db.select().from(project).where(eq(project.companyId, companyId));
  },

  update(id: string, data: Partial<NewProject>): Promise<Project[]> {
    return db
      .update(project)
      .set(data)
      .where(eq(project.id, id))
      .returning();
  },

  delete(id: string): Promise<Project[]> {
    return db
      .delete(project)
      .where(eq(project.id, id))
      .returning();
  }
};
