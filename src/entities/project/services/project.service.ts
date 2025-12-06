/**
 * Project Business Logic Service
 * Handles project operations with authorization and validation
 */

import { eq, and, desc, asc, sql, gte, lte } from "drizzle-orm";
import { db } from "@/shared/db";
import { subject } from "@casl/ability";
import { NewProject, project, Project } from "../schemas";
import { buildUserAbility } from "@/shared/lib/permissions";

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
 * Project service class with built-in authorization
 */
export class ProjectService {
  /**
   * Verify project ownership and throw if mismatch
   */
  private verifyOwnership(project: Project, companyId: string): void {
    if (project.companyId !== companyId) {
      throw new UnauthorizedError(
        "This project does not belong to your company"
      );
    }
  }

  /**
   * Check permission and throw if unauthorized
   */
  private async checkPermission(
    companyId: string,
    action: "create" | "view" | "update" | "delete"
  ): Promise<void> {
    const ability = await buildUserAbility(companyId);

    if (!ability.can(action, subject("project", {}))) {
      throw new UnauthorizedError(
        `You do not have permission to ${action} projects`
      );
    }
  }

  /**
   * Create a new project
   * @param companyId - Company ID for authorization
   * @param data - Project data to insert
   * @returns Created project
   */
  async create(companyId: string, data: NewProject): Promise<Project> {
    await this.checkPermission(companyId, "create");

    const [newProject] = await db.insert(project).values(data).returning();

    if (!newProject) {
      throw new Error("Failed to create project");
    }

    return newProject;
  }

  /**
   * Find project by ID with authorization check
   * @param companyId - Company ID for authorization
   * @param projectId - Project ID
   * @returns Project or undefined if not found
   */
  async findById(
    companyId: string,
    projectId: string
  ): Promise<Project | undefined> {
    await this.checkPermission(companyId, "view");

    const [result] = await db
      .select()
      .from(project)
      .where(eq(project.id, projectId))
      .limit(1);

    if (!result) return undefined;

    this.verifyOwnership(result, companyId);

    return result;
  }

  /**
   * Find project by ID (internal use without auth)
   */
  private async findByIdInternal(
    projectId: string
  ): Promise<Project | undefined> {
    const [result] = await db
      .select()
      .from(project)
      .where(eq(project.id, projectId))
      .limit(1);

    return result;
  }

  /**
   * Get all projects for a company
   * @param companyId - Company ID
   * @param options - Query options
   * @returns Array of projects
   */
  async findAll(
    companyId: string,
    options?: {
      limit?: number;
      offset?: number;
      orderBy?: "id" | "name" | "createdAt" | "updatedAt";
      order?: "asc" | "desc";
    }
  ): Promise<Project[]> {
    await this.checkPermission(companyId, "view");

    const limit = options?.limit ?? 50;
    const offset = options?.offset ?? 0;
    const orderField = options?.orderBy ?? "createdAt";
    const orderDirection = options?.order ?? "desc";

    const orderByColumn = {
      id: project.id,
      name: project.name,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }[orderField];

    const orderFn = orderDirection === "asc" ? asc : desc;

    return await db
      .select()
      .from(project)
      .where(eq(project.companyId, companyId))
      .orderBy(orderFn(orderByColumn))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Count total projects for a company
   * @param companyId - Company ID
   * @returns Total count
   */
  async count(companyId: string): Promise<number> {
    await this.checkPermission(companyId, "view");

    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(project)
      .where(eq(project.companyId, companyId));

    return result?.count ?? 0;
  }

  /**
   * Update project by ID
   * @param companyId - Company ID for authorization
   * @param projectId - Project ID
   * @param data - Partial project data to update
   * @returns Updated project
   */
  async update(
    companyId: string,
    projectId: string,
    data: Partial<Omit<NewProject, "id" | "companyId">>
  ): Promise<Project> {
    const existing = await this.findByIdInternal(projectId);

    if (!existing) {
      throw new NotFoundError("Project", projectId);
    }

    this.verifyOwnership(existing, companyId);
    await this.checkPermission(companyId, "update");

    const [updated] = await db
      .update(project)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(project.id, projectId))
      .returning();

    if (!updated) {
      throw new Error("Failed to update project");
    }

    return updated;
  }

  /**
   * Delete project by ID
   * @param companyId - Company ID for authorization
   * @param projectId - Project ID
   * @returns Deleted project
   */
  async delete(companyId: string, projectId: string): Promise<Project> {
    const existing = await this.findByIdInternal(projectId);

    if (!existing) {
      throw new NotFoundError("Project", projectId);
    }

    this.verifyOwnership(existing, companyId);
    await this.checkPermission(companyId, "delete");

    const [deleted] = await db
      .delete(project)
      .where(eq(project.id, projectId))
      .returning();

    if (!deleted) {
      throw new Error("Failed to delete project");
    }

    return deleted;
  }

  /**
   * Find projects created within a date range
   * @param companyId - Company ID
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Array of projects
   */
  async findByDateRange(
    companyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Project[]> {
    await this.checkPermission(companyId, "view");

    return await db
      .select()
      .from(project)
      .where(
        and(
          eq(project.companyId, companyId),
          gte(project.createdAt, startDate),
          lte(project.createdAt, endDate)
        )
      )
      .orderBy(desc(project.createdAt));
  }

  /**
   * Find recently updated projects
   * @param companyId - Company ID
   * @param hours - Number of hours to look back (default: 24)
   * @returns Array of recently updated projects
   */
  async findRecentlyUpdated(
    companyId: string,
    hours: number = 24
  ): Promise<Project[]> {
    await this.checkPermission(companyId, "view");

    const cutoffDate = new Date(Date.now() - hours * 60 * 60 * 1000);

    return await db
      .select()
      .from(project)
      .where(
        and(
          eq(project.companyId, companyId),
          gte(project.updatedAt, cutoffDate)
        )
      )
      .orderBy(desc(project.updatedAt));
  }

  /**
   * Check if project exists
   * @param companyId - Company ID
   * @param projectId - Project ID
   * @returns True if exists and belongs to company, false otherwise
   */
  async exists(companyId: string, projectId: string): Promise<boolean> {
    const [result] = await db
      .select({ id: project.id })
      .from(project)
      .where(and(eq(project.id, projectId), eq(project.companyId, companyId)))
      .limit(1);

    return !!result;
  }

  /**
   * Bulk create projects
   * @param companyId - Company ID for authorization
   * @param projects - Array of project data
   * @returns Array of created projects
   */
  async bulkCreate(
    companyId: string,
    projects: NewProject[]
  ): Promise<Project[]> {
    if (projects.length === 0) return [];

    await this.checkPermission(companyId, "create");

    // Verify all projects belong to the company
    const invalidProjects = projects.filter((p) => p.companyId !== companyId);
    if (invalidProjects.length > 0) {
      throw new UnauthorizedError("All projects must belong to your company");
    }

    return await db.insert(project).values(projects).returning();
  }

  /**
   * Archive/unarchive project (soft delete pattern)
   * @param companyId - Company ID
   * @param projectId - Project ID
   * @param archived - Archive status
   * @returns Updated project
   */
  async setArchived(
    companyId: string,
    projectId: string,
    archived: boolean
  ): Promise<Project> {
    return await this.update(companyId, projectId, {
      metadata: { archived },
    });
  }
}

/**
 * Singleton project service instance
 */
export const projectService = new ProjectService();
