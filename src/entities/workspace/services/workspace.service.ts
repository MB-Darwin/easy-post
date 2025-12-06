/**
 * Workspace Business Logic Service
 * Handles workspace operations with authorization and validation
 */

import { eq, and, desc, asc, sql, gte, lte, like } from "drizzle-orm";
import { db } from "@/shared/db";
import {
  workspace,
  type Workspace,
  type NewWorkspace,
} from "@/entities/workspace/schemas";
import { buildUserAbility } from "@/shared/lib/permissions";
import { subject } from "@casl/ability";

/**
 * Authorization error thrown when user lacks permissions
 */
export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Not found error thrown when resource doesn't exist
 */
export class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`);
    this.name = "NotFoundError";
  }
}

/**
 * Workspace service class with built-in authorization
 */
export class WorkspaceService {
  /**
   * Check permission and throw if unauthorized
   */
  private async checkPermission(
    userId: string,
    action: "create" | "view" | "update" | "delete",
    companyId: string
  ): Promise<void> {
    const ability = await buildUserAbility(userId);

    if (!ability.can(action, subject("workspace", { companyId }))) {
      throw new UnauthorizedError(
        `You do not have permission to ${action} workspaces`
      );
    }
  }

  /**
   * Find workspace by ID (internal use without auth)
   */
  private async findByIdInternal(
    workspaceId: string
  ): Promise<Workspace | undefined> {
    const [result] = await db
      .select()
      .from(workspace)
      .where(eq(workspace.id, workspaceId))
      .limit(1);

    return result;
  }

  /**
   * Create a new workspace
   * @param userId - User ID for authorization
   * @param data - Workspace data to insert
   * @returns Created workspace
   */
  async create(userId: string, data: NewWorkspace): Promise<Workspace> {
    await this.checkPermission(userId, "create", data.companyId);

    const [newWorkspace] = await db.insert(workspace).values(data).returning();

    if (!newWorkspace) {
      throw new Error("Failed to create workspace");
    }

    return newWorkspace;
  }

  /**
   * Find workspace by ID with authorization check
   * @param userId - User ID for authorization
   * @param workspaceId - Workspace ID
   * @returns Workspace or undefined if not found
   */
  async findById(
    userId: string,
    workspaceId: string
  ): Promise<Workspace | undefined> {
    const result = await this.findByIdInternal(workspaceId);

    if (!result) return undefined;

    await this.checkPermission(userId, "view", result.companyId);

    return result;
  }

  /**
   * Find workspace by name within a company
   * @param userId - User ID for authorization
   * @param companyId - Company ID
   * @param name - Workspace name
   * @returns Workspace or undefined if not found
   */
  async findByName(
    userId: string,
    companyId: string,
    name: string
  ): Promise<Workspace | undefined> {
    await this.checkPermission(userId, "view", companyId);

    const [result] = await db
      .select()
      .from(workspace)
      .where(and(eq(workspace.companyId, companyId), eq(workspace.name, name)))
      .limit(1);

    return result;
  }

  /**
   * Get all workspaces for a company
   * @param userId - User ID for authorization
   * @param companyId - Company ID
   * @param options - Query options
   * @returns Array of workspaces
   */
  async findByCompany(
    userId: string,
    companyId: string,
    options?: {
      limit?: number;
      offset?: number;
      orderBy?: "id" | "name" | "createdAt" | "updatedAt";
      order?: "asc" | "desc";
      search?: string;
    }
  ): Promise<Workspace[]> {
    await this.checkPermission(userId, "view", companyId);

    const limit = options?.limit ?? 50;
    const offset = options?.offset ?? 0;
    const orderField = options?.orderBy ?? "createdAt";
    const orderDirection = options?.order ?? "desc";

    const orderByColumn = {
      id: workspace.id,
      name: workspace.name,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
    }[orderField];

    const orderFn = orderDirection === "asc" ? asc : desc;

    let query = db
      .select()
      .from(workspace)
      .where(eq(workspace.companyId, companyId));

    // Apply search filter if provided
    if (options?.search) {
      query = query.where(
        and(
          eq(workspace.companyId, companyId),
          like(workspace.name, `%${options.search}%`)
        )
      );
    }

    return await query
      .orderBy(orderFn(orderByColumn))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Count total workspaces for a company
   * @param userId - User ID for authorization
   * @param companyId - Company ID
   * @param search - Optional search filter
   * @returns Total count
   */
  async count(
    userId: string,
    companyId: string,
    search?: string
  ): Promise<number> {
    await this.checkPermission(userId, "view", companyId);

    let query = db
      .select({ count: sql<number>`count(*)` })
      .from(workspace)
      .where(eq(workspace.companyId, companyId));

    if (search) {
      query = query.where(
        and(
          eq(workspace.companyId, companyId),
          like(workspace.name, `%${search}%`)
        )
      );
    }

    const [result] = await query;

    return result?.count ?? 0;
  }

  /**
   * Update workspace by ID
   * @param userId - User ID for authorization
   * @param workspaceId - Workspace ID
   * @param data - Partial workspace data to update
   * @returns Updated workspace
   */
  async update(
    userId: string,
    workspaceId: string,
    data: Partial<Omit<NewWorkspace, "id" | "companyId">>
  ): Promise<Workspace> {
    const existing = await this.findByIdInternal(workspaceId);

    if (!existing) {
      throw new NotFoundError("Workspace", workspaceId);
    }

    await this.checkPermission(userId, "update", existing.companyId);

    const [updated] = await db
      .update(workspace)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(workspace.id, workspaceId))
      .returning();

    if (!updated) {
      throw new Error("Failed to update workspace");
    }

    return updated;
  }

  /**
   * Delete workspace by ID
   * @param userId - User ID for authorization
   * @param workspaceId - Workspace ID
   * @returns Deleted workspace
   */
  async delete(userId: string, workspaceId: string): Promise<Workspace> {
    const existing = await this.findByIdInternal(workspaceId);

    if (!existing) {
      throw new NotFoundError("Workspace", workspaceId);
    }

    await this.checkPermission(userId, "delete", existing.companyId);

    const [deleted] = await db
      .delete(workspace)
      .where(eq(workspace.id, workspaceId))
      .returning();

    if (!deleted) {
      throw new Error("Failed to delete workspace");
    }

    return deleted;
  }

  /**
   * Find workspaces created within a date range
   * @param userId - User ID for authorization
   * @param companyId - Company ID
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Array of workspaces
   */
  async findByDateRange(
    userId: string,
    companyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Workspace[]> {
    await this.checkPermission(userId, "view", companyId);

    return await db
      .select()
      .from(workspace)
      .where(
        and(
          eq(workspace.companyId, companyId),
          gte(workspace.createdAt, startDate),
          lte(workspace.createdAt, endDate)
        )
      )
      .orderBy(desc(workspace.createdAt));
  }

  /**
   * Find recently updated workspaces
   * @param userId - User ID for authorization
   * @param companyId - Company ID
   * @param hours - Number of hours to look back (default: 24)
   * @returns Array of recently updated workspaces
   */
  async findRecentlyUpdated(
    userId: string,
    companyId: string,
    hours: number = 24
  ): Promise<Workspace[]> {
    await this.checkPermission(userId, "view", companyId);

    const cutoffDate = new Date(Date.now() - hours * 60 * 60 * 1000);

    return await db
      .select()
      .from(workspace)
      .where(
        and(
          eq(workspace.companyId, companyId),
          gte(workspace.updatedAt, cutoffDate)
        )
      )
      .orderBy(desc(workspace.updatedAt));
  }

  /**
   * Check if workspace exists
   * @param userId - User ID for authorization
   * @param companyId - Company ID
   * @param workspaceId - Workspace ID
   * @returns True if exists and user has access, false otherwise
   */
  async exists(
    userId: string,
    companyId: string,
    workspaceId: string
  ): Promise<boolean> {
    await this.checkPermission(userId, "view", companyId);

    const [result] = await db
      .select({ id: workspace.id })
      .from(workspace)
      .where(
        and(eq(workspace.id, workspaceId), eq(workspace.companyId, companyId))
      )
      .limit(1);

    return !!result;
  }

  /**
   * Check if workspace name exists within a company
   * @param userId - User ID for authorization
   * @param companyId - Company ID
   * @param name - Workspace name
   * @param excludeId - Optional ID to exclude (for updates)
   * @returns True if exists, false otherwise
   */
  async nameExists(
    userId: string,
    companyId: string,
    name: string,
    excludeId?: string
  ): Promise<boolean> {
    await this.checkPermission(userId, "view", companyId);

    let query = db
      .select({ id: workspace.id })
      .from(workspace)
      .where(and(eq(workspace.companyId, companyId), eq(workspace.name, name)));

    if (excludeId) {
      query = query.where(sql`${workspace.id} != ${excludeId}`);
    }

    const [result] = await query.limit(1);

    return !!result;
  }

  /**
   * Bulk create workspaces
   * @param userId - User ID for authorization
   * @param companyId - Company ID
   * @param workspaces - Array of workspace data
   * @returns Array of created workspaces
   */
  async bulkCreate(
    userId: string,
    companyId: string,
    workspaces: NewWorkspace[]
  ): Promise<Workspace[]> {
    if (workspaces.length === 0) return [];

    await this.checkPermission(userId, "create", companyId);

    // Verify all workspaces belong to the company
    const invalidWorkspaces = workspaces.filter(
      (w) => w.companyId !== companyId
    );
    if (invalidWorkspaces.length > 0) {
      throw new UnauthorizedError(
        "All workspaces must belong to the specified company"
      );
    }

    return await db.insert(workspace).values(workspaces).returning();
  }

  /**
   * Search workspaces by name within a company
   * @param userId - User ID for authorization
   * @param companyId - Company ID
   * @param searchTerm - Search term
   * @param limit - Max results (default: 20)
   * @returns Array of matching workspaces
   */
  async search(
    userId: string,
    companyId: string,
    searchTerm: string,
    limit: number = 20
  ): Promise<Workspace[]> {
    await this.checkPermission(userId, "view", companyId);

    return await db
      .select()
      .from(workspace)
      .where(
        and(
          eq(workspace.companyId, companyId),
          like(workspace.name, `%${searchTerm}%`)
        )
      )
      .limit(limit)
      .orderBy(asc(workspace.name));
  }

  /**
   * Archive/unarchive workspace (soft delete pattern)
   * @param userId - User ID for authorization
   * @param workspaceId - Workspace ID
   * @param archived - Archive status
   * @returns Updated workspace
   */
  async setArchived(
    userId: string,
    workspaceId: string,
    archived: boolean
  ): Promise<Workspace> {
    return await this.update(userId, workspaceId, {
      metadata: { archived },
    });
  }
}

/**
 * Singleton workspace service instance
 */
export const workspaceService = new WorkspaceService();
