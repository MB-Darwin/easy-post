import { createdAt, createTable, id, updatedAt } from "@/shared/utils";
import { relations } from "drizzle-orm";
import { index, integer, jsonb, pgEnum, pgTable, text, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";

/**
 * Company table schema
 * Stores company/tenant information from Genuka
 */

export const socialPlatformEnum = pgEnum("social_platform", [
  "facebook",
  "instagram",
  "threads",
  "tiktok",
  "linkedin",
  "twitter",
  "discord",
]);

export const postStatusEnum = pgEnum("post_status", [
  "draft",
  "scheduled",
  "published",
  "failed",
]);

export const accountStatusEnum = pgEnum("account_status", [
  "active",
  "disconnected",
  "expired",
]);

export const campaignStatusEnum = pgEnum('campaign_status', ['DRAFT', 'SCHEDULED', 'ACTIVE', 'COMPLETED', 'PAUSED']);
export const postType = pgEnum('post_type', ['STORY', 'REEL', 'PUBLICATION']);

export const company = createTable(
  "company",
  (d) => ({
    id: d.text("id").primaryKey().notNull(),
    categoryId: d.uuid("category_id").references(() => category.id, { onDelete: "cascade" }),
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
    index("company_category_id_idx").on(table.categoryId),
  ]
);

export const socialAccounts = createTable( "social_accounts", (d) => ({
  id: d.uuid("id").primaryKey().defaultRandom(),
  companyId: d.text("company_id")
    .notNull()
    .references(() => company.id, { onDelete: "cascade" }),
  platform: socialPlatformEnum("platform").notNull(),
  platformAccountId: d.text("platform_account_id").notNull(),
  username: d.text("username").notNull(),
  displayName: d.text("display_name"),
  profilePicture: d.text("profile_picture"),
  accessToken: d.text("access_token").notNull(),
  refreshToken: d.text("refresh_token"),
  tokenExpiresAt: d.timestamp("token_expires_at"),
  lastSyncedAt: d.timestamp("last_synced_at"),
  status: accountStatusEnum("status").default("active").notNull(),
  metadata: d.jsonb("metadata"),
  createdAt: d.timestamp("created_at").defaultNow().notNull(),
  updatedAt: d.timestamp("updated_at").defaultNow().notNull(),
}),
(table) => [
  index("social_accounts_company_id_idx").on(table.companyId),
  index("social_accounts_platform_idx").on(table.platform),
  index("social_accounts_status_idx").on(table.status),
  unique("social_accounts_platform_account_unique").on(table.platform, table.platformAccountId),
]);

export const category = createTable("category", (d) => ({
  id: d.uuid("id").primaryKey().defaultRandom(),
  name: d.varchar("name").notNull(),
  description: d.text("description").notNull(),
  createdAt: d.timestamp("created_at").defaultNow().notNull(),
  updatedAt: d.timestamp("updated_at").defaultNow().notNull(),
}),
(table) => [
  index("category_name_idx").on(table.name),
]);

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

// ✅ SOLUTION: Déclarer workspace AVANT posts (sans référence à posts)
export const workspace = createTable("workspace", (d) => ({
  id: d.uuid("id").primaryKey().defaultRandom(),
  companyId: d.text("company_id").notNull().references(() => company.id, { onDelete: "cascade" }),
  name: d.text("name").notNull(),
  description: d.text("description"),
  createdAt: d.timestamp("created_at").defaultNow().notNull(),
  updatedAt: d.timestamp("updated_at").defaultNow().notNull(),
}), (table) => [
  index("workspace_company_id_idx").on(table.companyId),
]);

// ✅ SOLUTION: Déclarer posts APRÈS workspace (posts référence workspace, pas l'inverse)
export const posts = createTable("posts", (d) => ({
  id: d.uuid("id").primaryKey().defaultRandom(),
  companyId: d.text("company_id")
    .notNull()
    .references(() => company.id, { onDelete: "cascade" }),
  title: d.text("title"),
  content: d.text("content").notNull(),
  type: postType("type").default("PUBLICATION").notNull(),
  status: postStatusEnum("status").default("draft").notNull(),
  projectId: d.uuid("project_id")
    .references(() => project.id, { onDelete: "set null" }),
  workspaceId: d.uuid("workspace_id")
    .references(() => workspace.id, { onDelete: "set null" }),
  scheduledAt: d.timestamp("scheduled_at"),
  publishedAt: d.timestamp("published_at"),
  media: d.jsonb("media"), // Array of media URLs and metadata
  metadata: d.jsonb("metadata"),
  createdAt: d.timestamp("created_at").defaultNow().notNull(),
  updatedAt: d.timestamp("updated_at").defaultNow().notNull(),
}),
(table) => [
  index("posts_company_id_idx").on(table.companyId),
  index("posts_project_id_idx").on(table.projectId),
  index("posts_workspace_id_idx").on(table.workspaceId),
  index("posts_status_idx").on(table.status),
  index("posts_scheduled_at_idx").on(table.scheduledAt),
  index("posts_published_at_idx").on(table.publishedAt),
]);

export const permission = createTable("permission", (d) => ({
  id: d.uuid("id").primaryKey().defaultRandom(),
  categoryId: d.uuid("category_id")
    .notNull()
    .references(() => category.id, { onDelete: "cascade" }),
  name: d.varchar("name").unique().notNull(),
  description: d.text("description").notNull(),
  createdAt: d.timestamp("created_at").defaultNow().notNull(),
  updatedAt: d.timestamp("updated_at").defaultNow().notNull(),
}),
(table) => [
  index("permission_category_id_idx").on(table.categoryId),
  index("permission_name_idx").on(table.name),
]);

export const postAccounts = createTable("post_accounts", (d) => ({
  id: d.uuid("id").primaryKey().defaultRandom(),
  postId: d.uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  accountId: d.uuid("account_id")
    .notNull()
    .references(() => socialAccounts.id, { onDelete: "cascade" }),
  platformPostId: d.text("platform_post_id"),
  status: postStatusEnum("status").default("scheduled").notNull(),
  error: d.text("error"),
  retryCount: d.integer("retry_count").default(0),
  publishedAt: d.timestamp("published_at"),
  createdAt: d.timestamp("created_at").defaultNow().notNull(),
}), (table) => [
  index("post_accounts_post_id_idx").on(table.postId),
  index("post_accounts_account_id_idx").on(table.accountId),
  index("post_accounts_status_idx").on(table.status),
  unique("post_accounts_unique").on(table.postId, table.accountId),
]);

export const analytics = createTable("analytics", (d) => ({
  id: d.uuid("id").primaryKey().defaultRandom(),
  postAccountId: d.uuid("post_account_id")
    .notNull()
    .references(() => postAccounts.id, { onDelete: "cascade" }),
  likes: d.integer("likes").default(0),
  comments: d.integer("comments").default(0),
  shares: d.integer("shares").default(0),
  views: d.integer("views").default(0),
  rawData: d.jsonb("raw_data"),
  fetchedAt: d.timestamp("fetched_at").defaultNow().notNull(),
  createdAt: d.timestamp("created_at").defaultNow().notNull(),
  updatedAt: d.timestamp("updated_at").defaultNow().notNull(),
}), (table) => [
  index("analytics_post_account_id_idx").on(table.postAccountId),
  index("analytics_fetched_at_idx").on(table.fetchedAt),
]);

// =====================
// Relations
// =====================
export const companyRelations = relations(company, ({ one, many }) => ({
  category: one(category, {
    fields: [company.categoryId],
    references: [category.id],
  }),
  socialAccounts: many(socialAccounts),
  posts: many(posts),
  projects: many(project),
  workspaces: many(workspace),
}));

export const categoryRelations = relations(category, ({ many }) => ({
  companies: many(company),
  permissions: many(permission),
}));

export const socialAccountsRelations = relations(socialAccounts, ({ one, many }) => ({
  company: one(company, {
    fields: [socialAccounts.companyId],
    references: [company.id],
  }),
  postAccounts: many(postAccounts),
}));

export const projectRelations = relations(project, ({ one, many }) => ({
  company: one(company, {
    fields: [project.companyId],
    references: [company.id],
  }),
  posts: many(posts),
}));

export const workspaceRelations = relations(workspace, ({ one, many }) => ({
  company: one(company, {
    fields: [workspace.companyId],
    references: [company.id],
  }),
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  company: one(company, {
    fields: [posts.companyId],
    references: [company.id],
  }),
  project: one(project, {
    fields: [posts.projectId],
    references: [project.id],
  }),
  workspace: one(workspace, {
    fields: [posts.workspaceId],
    references: [workspace.id],
  }),
  postAccounts: many(postAccounts),
}));

export const permissionRelations = relations(permission, ({ one }) => ({
  category: one(category, {
    fields: [permission.categoryId],
    references: [category.id],
  }),
}));

export const postAccountsRelations = relations(postAccounts, ({ one, many }) => ({
  post: one(posts, {
    fields: [postAccounts.postId],
    references: [posts.id],
  }),
  account: one(socialAccounts, {
    fields: [postAccounts.accountId],
    references: [socialAccounts.id],
  }),
  analytics: many(analytics),
}));

export const analyticsRelations = relations(analytics, ({ one }) => ({
  postAccount: one(postAccounts, {
    fields: [analytics.postAccountId],
    references: [postAccounts.id],
  }),
}));

// =====================
// Types
// =====================
export type SocialAccount = typeof socialAccounts.$inferSelect;
export type NewSocialAccount = typeof socialAccounts.$inferInsert;

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type PostAccount = typeof postAccounts.$inferSelect;
export type NewPostAccount = typeof postAccounts.$inferInsert;

export type Category = typeof category.$inferSelect;
export type NewCategory = typeof category.$inferInsert;

export type Permission = typeof permission.$inferSelect;
export type NewPermission = typeof permission.$inferInsert;

export type Project = typeof project.$inferSelect;
export type NewProject = typeof project.$inferInsert;

export type CompanySelect = typeof company.$inferSelect;
export type CompanyInsert = typeof company.$inferInsert;
export type CompanyUpdate = Partial<CompanyInsert>;

export type Company = CompanySelect;
export type NewCompany = CompanyInsert;

export type Workspace = typeof workspace.$inferSelect;
export type NewWorkspace = typeof workspace.$inferInsert;

export type Analytics = typeof analytics.$inferSelect;
export type NewAnalytics = typeof analytics.$inferInsert;