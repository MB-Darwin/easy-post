import { db } from "../../shared/db/index";
import { category, Category, NewCategory } from "@/shared/db/schemas";
import { eq } from "drizzle-orm";

export const CategoryRepo = {
  create(data: NewCategory): Promise<Category[]> {
    return db.insert(category).values(data).returning();
  },

  findById(id: string): Promise<Category[]> {
    return db.select().from(category).where(eq(category.id, id));
  },

  findAll(): Promise<Category[]> {
    return db.select().from(category);
  },

  update(id: string, data: Partial<NewCategory>): Promise<Category[]> {
    return db
      .update(category)
      .set(data)
      .where(eq(category.id, id))
      .returning(); // Drizzle renvoie un array des lignes mises à jour
  },

  delete(id: string): Promise<Category[]> {
    return db
      .delete(category)
      .where(eq(category.id, id))
      .returning(); //renvoie les lignes supprimées
    }
};              