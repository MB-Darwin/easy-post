/**
 * Category Database Service
 * Handles all database operations for categories using Drizzle ORM
 */

import { eq, and, desc, asc, sql, gte, lte, like } from "drizzle-orm";
import { db } from "@/shared/db";
import { category, type Category, type NewCategory } from "@/shared/db/schemas";

/**
 * Category service class
 * Provides methods for CRUD operations and queries on category data
 */
export class CategoryService {
  /**
   * Create a new category
   * @param data - Category data to insert
   * @returns Created category
   */
  async create(data: NewCategory): Promise<Category> {
    const [newCategory] = await db.insert(category).values(data).returning();

    if (!newCategory) {
      throw new Error("Failed to create category");
    }

    return newCategory;
  }

  /**
   * Create or update a category (upsert)
   * @param data - Category data
   * @returns Upserted category
   */
  async upsert(data: NewCategory): Promise<Category> {
    const now = new Date();

    const [upsertedCategory] = await db
      .insert(category)
      .values({
        ...data,
        updatedAt: now,
        createdAt: data.createdAt ?? now,
      })
      .onConflictDoUpdate({
        target: category.id,
        set: {
          ...data,
          updatedAt: now,
        },
      })
      .returning();

    if (!upsertedCategory) {
      throw new Error("Failed to upsert category");
    }

    return upsertedCategory;
  }

  /**
   * Find category by ID
   * @param id - Category ID
   * @returns Category or undefined if not found
   */
  async findById(id: string): Promise<Category | undefined> {
    const [result] = await db
      .select()
      .from(category)
      .where(eq(category.id, id))
      .limit(1);

    return result;
  }

  /**
   * Find category by name
   * @param name - Category name
   * @returns Category or undefined if not found
   */
  async findByName(name: string): Promise<Category | undefined> {
    const [result] = await db
      .select()
      .from(category)
      .where(eq(category.name, name))
      .limit(1);

    return result;
  }

  /**
   * Get all categories with pagination and filtering
   * @param options - Query options
   * @returns Array of categories
   */
  async findAll(options?: {
    limit?: number;
    offset?: number;
    orderBy?: "id" | "name" | "createdAt" | "updatedAt";
    order?: "asc" | "desc";
    search?: string;
  }): Promise<Category[]> {
    const limit = options?.limit ?? 50;
    const offset = options?.offset ?? 0;
    const orderField = options?.orderBy ?? "createdAt";
    const orderDirection = options?.order ?? "desc";

    const orderByColumn = {
      id: category.id,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }[orderField];

    const orderFn = orderDirection === "asc" ? asc : desc;

    let query = db.select().from(category);

    // Apply search filter if provided
    if (options?.search) {
      query = query.where(like(category.name, `%${options.search}%`));
    }

    return await query
      .orderBy(orderFn(orderByColumn))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Count total categories
   * @param search - Optional search filter
   * @returns Total count
   */
  async count(search?: string): Promise<number> {
    let query = db.select({ count: sql<number>`count(*)` }).from(category);

    if (search) {
      query = query.where(like(category.name, `%${search}%`));
    }

    const [result] = await query;

    return result?.count ?? 0;
  }

  /**
   * Update category by ID
   * @param id - Category ID
   * @param data - Partial category data to update
   * @returns Updated category or undefined if not found
   */
  async update(
    id: string,
    data: Partial<Omit<NewCategory, "id">>
  ): Promise<Category | undefined> {
    const [updated] = await db
      .update(category)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(category.id, id))
      .returning();

    return updated;
  }

  /**
   * Delete category by ID
   * @param id - Category ID
   * @returns Deleted category or undefined if not found
   */
  async delete(id: string): Promise<Category | undefined> {
    const [deleted] = await db
      .delete(category)
      .where(eq(category.id, id))
      .returning();

    return deleted;
  }

  /**
   * Find categories created within a date range
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Array of categories
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<Category[]> {
    return await db
      .select()
      .from(category)
      .where(
        and(
          gte(category.createdAt, startDate),
          lte(category.createdAt, endDate)
        )
      )
      .orderBy(desc(category.createdAt));
  }

  /**
   * Find categories that have been recently updated
   * @param hours - Number of hours to look back (default: 24)
   * @returns Array of recently updated categories
   */
  async findRecentlyUpdated(hours: number = 24): Promise<Category[]> {
    const cutoffDate = new Date(Date.now() - hours * 60 * 60 * 1000);

    return await db
      .select()
      .from(category)
      .where(gte(category.updatedAt, cutoffDate))
      .orderBy(desc(category.updatedAt));
  }

  /**
   * Check if category exists by ID
   * @param id - Category ID
   * @returns True if exists, false otherwise
   */
  async exists(id: string): Promise<boolean> {
    const [result] = await db
      .select({ id: category.id })
      .from(category)
      .where(eq(category.id, id))
      .limit(1);

    return !!result;
  }

  /**
   * Check if category name exists
   * @param name - Category name
   * @param excludeId - Optional ID to exclude (for updates)
   * @returns True if exists, false otherwise
   */
  async nameExists(name: string, excludeId?: string): Promise<boolean> {
    let query = db
      .select({ id: category.id })
      .from(category)
      .where(eq(category.name, name));

    if (excludeId) {
      query = query.where(sql`${category.id} != ${excludeId}`);
    }

    const [result] = await query.limit(1);

    return !!result;
  }

  /**
   * Bulk create categories
   * @param categories - Array of category data
   * @returns Array of created categories
   */
  async bulkCreate(categories: NewCategory[]): Promise<Category[]> {
    if (categories.length === 0) return [];

    return await db.insert(category).values(categories).returning();
  }

  /**
   * Bulk delete categories
   * @param ids - Array of category IDs
   * @returns Number of deleted categories
   */
  async bulkDelete(ids: string[]): Promise<number> {
    if (ids.length === 0) return 0;

    const result = await db
      .delete(category)
      .where(sql`${category.id} = ANY(${ids})`)
      .returning();

    return result.length;
  }

  /**
   * Search categories by name with fuzzy matching
   * @param searchTerm - Search term
   * @param limit - Max results (default: 20)
   * @returns Array of matching categories
   */
  async search(searchTerm: string, limit: number = 20): Promise<Category[]> {
    return await db
      .select()
      .from(category)
      .where(like(category.name, `%${searchTerm}%`))
      .limit(limit)
      .orderBy(asc(category.name));
  }
}

/**
 * Singleton category service instance
 */
export const categoryService = new CategoryService();
