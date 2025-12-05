/**
 * Company Database Service
 * Handles all database operations for companies using Drizzle ORM
 */

import { eq, and, desc, asc, sql, gte, lte } from "drizzle-orm";
import { db } from "@/shared/db";
import {
  company,
  type Company,
  type NewCompany,
} from "../schema/company.schema";

/**
 * Company service class
 * Provides methods for CRUD operations and queries on company data
 */
export class CompanyService {
  /**
   * Create a new company
   * @param data - Company data to insert
   * @returns Created company
   */
  async create(data: NewCompany): Promise<Company> {
    const [newCompany] = await db.insert(company).values(data).returning();

    if (!newCompany) {
      throw new Error("Failed to create company");
    }

    return newCompany;
  }

  /**
   * Create or update a company (upsert)
   * @param data - Company data
   * @returns Upserted company
   */
  async upsert(data: NewCompany): Promise<Company> {
    const now = new Date();

    console.log("Upserting company", data);

    const [upsertedCompany] = await db
      .insert(company)
      .values({
        ...data,
        updatedAt: now,
        createdAt: data.createdAt ?? now,
      })
      .onConflictDoUpdate({
        target: company.id,
        set: {
          id: data.id,
          handle: data.handle ?? null,
          description: data.description ?? null,
          logoUrl: data.logoUrl ?? null,
          phone: data.phone ?? null,
          accessToken: data.accessToken ?? null,
          refreshToken: data.refreshToken ?? null,
          tokenExpiresAt: data.tokenExpiresAt ?? null,
          metadata: data.metadata ?? {},
          updatedAt: now,
        },
      })
      .returning();

    if (!upsertedCompany) {
      throw new Error("Failed to upsert company");
    }

    return upsertedCompany;
  }

  /**
   * Find company by ID
   * @param id - Company ID
   * @returns Company or undefined if not found
   */
  async findById(id: string): Promise<Company | undefined> {
    const [result] = await db
      .select()
      .from(company)
      .where(eq(company.id, id))
      .limit(1);

    return result;
  }

  /**
   * Find company by handle
   * @param handle - Company handle
   * @returns Company or undefined if not found
   */
  async findByHandle(handle: string): Promise<Company | undefined> {
    const [result] = await db
      .select()
      .from(company)
      .where(eq(company.handle, handle))
      .limit(1);

    return result;
  }

  /**
   * Get all companies with pagination
   * @param options - Pagination options
   * @returns Array of companies
   */
  async findAll(options?: {
    limit?: number;
    offset?: number;
    orderBy?: "id" | "createdAt" | "updatedAt";
    order?: "asc" | "desc";
  }): Promise<Company[]> {
    const limit = options?.limit ?? 50;
    const offset = options?.offset ?? 0;
    const orderField = options?.orderBy ?? "createdAt";
    const orderDirection = options?.order ?? "desc";

    const orderByColumn = {
      id: company.id,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    }[orderField];

    const orderFn = orderDirection === "asc" ? asc : desc;

    return await db
      .select()
      .from(company)
      .orderBy(orderFn(orderByColumn))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Count total companies
   * @returns Total count
   */
  async count(): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(company);

    return result?.count ?? 0;
  }

  /**
   * Update company by ID
   * @param id - Company ID
   * @param data - Partial company data to update
   * @returns Updated company or undefined if not found
   */
  async update(
    id: string,
    data: Partial<Omit<NewCompany, "id">>
  ): Promise<Company | undefined> {
    const [updated] = await db
      .update(company)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(company.id, id))
      .returning();

    return updated;
  }

  /**
   * Update company tokens
   * @param id - Company ID
   * @param tokens - Token data
   * @returns Updated company or undefined if not found
   */
  async updateTokens(
    id: string,
    tokens: {
      accessToken: string;
      refreshToken?: string;
      tokenExpiresAt?: Date;
      refreshTokenExpiresAt?: Date;
    }
  ): Promise<Company | undefined> {
    const [updated] = await db
      .update(company)
      .set({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenExpiresAt: tokens.tokenExpiresAt,
        updatedAt: new Date(),
      })
      .where(eq(company.id, id))
      .returning();

    return updated;
  }

  /**
   * Update company metadata
   * @param id - Company ID
   * @param metadata - Metadata to merge with existing
   * @returns Updated company or undefined if not found
   */
  async updateMetadata(
    id: string,
    metadata: Record<string, unknown>
  ): Promise<Company | undefined> {
    // First get the current metadata
    const current = await this.findById(id);
    if (!current) return undefined;

    const mergedMetadata = {
      ...((current.metadata as Record<string, unknown>) || {}),
      ...metadata,
    };

    return await this.update(id, { metadata: mergedMetadata });
  }

  /**
   * Delete company by ID
   * @param id - Company ID
   * @returns Deleted company or undefined if not found
   */
  async delete(id: string): Promise<Company | undefined> {
    const [deleted] = await db
      .delete(company)
      .where(eq(company.id, id))
      .returning();

    return deleted;
  }

  /**
   * Find companies with expired access tokens
   * @returns Array of companies with expired tokens
   */
  async findExpiredTokens(): Promise<Company[]> {
    const now = new Date();

    return await db
      .select()
      .from(company)
      .where(
        and(
          sql`${company.tokenExpiresAt} IS NOT NULL`,
          lte(company.tokenExpiresAt, now)
        )
      );
  }

  /**
   * Find companies created within a date range
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Array of companies
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<Company[]> {
    return await db
      .select()
      .from(company)
      .where(
        and(gte(company.createdAt, startDate), lte(company.createdAt, endDate))
      )
      .orderBy(desc(company.createdAt));
  }

  /**
   * Find companies that have been recently updated
   * @param hours - Number of hours to look back (default: 24)
   * @returns Array of recently updated companies
   */
  async findRecentlyUpdated(hours: number = 24): Promise<Company[]> {
    const cutoffDate = new Date(Date.now() - hours * 60 * 60 * 1000);

    return await db
      .select()
      .from(company)
      .where(gte(company.updatedAt, cutoffDate))
      .orderBy(desc(company.updatedAt));
  }

  /**
   * Check if company exists by ID
   * @param id - Company ID
   * @returns True if exists, false otherwise
   */
  async exists(id: string): Promise<boolean> {
    const [result] = await db
      .select({ id: company.id })
      .from(company)
      .where(eq(company.id, id))
      .limit(1);

    return !!result;
  }

  /**
   * Bulk create companies
   * @param companies - Array of company data
   * @returns Array of created companies
   */
  async bulkCreate(companies: NewCompany[]): Promise<Company[]> {
    if (companies.length === 0) return [];

    return await db.insert(company).values(companies).returning();
  }

  /**
   * Get company with token validity check
   * @param id - Company ID
   * @returns Company with isTokenValid flag
   */
  async getWithTokenStatus(
    id: string
  ): Promise<(Company & { isTokenValid: boolean }) | undefined> {
    const result = await this.findById(id);
    if (!result) return undefined;

    const now = new Date();
    const isTokenValid = result.tokenExpiresAt
      ? result.tokenExpiresAt > now
      : false;

    return {
      ...result,
      isTokenValid,
    };
  }
}

/**
 * Singleton company service instance
 */
export const companyService = new CompanyService();
