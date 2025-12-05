import { createdAt, createTable, id, updatedAt } from "@/shared/utils";
import { relations } from "drizzle-orm";
import { index, integer, jsonb, pgEnum, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

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
    id: id(),
    name: d.text("name").notNull(),
    handle: d.text("handle"),
    description: d.text("description"),
    logoUrl: d.text("logo_url"),
    phone: d.text("phone"),

    // OAuth tokens
    accessToken: d.text("access_token"),
    refreshToken: d.text("refresh_token"),
    tokenExpiresAt: d.timestamp("token_expires_at"),

    // Additional metadata from Genuka API
    metadata: d.jsonb("metadata"),

    // Timestamps
    createdAt,
    updatedAt,
  }),
  (table) => [
    index("company_handle_idx").on(table.handle),
    index("company_name_idx").on(table.name),
    unique("company_handle_unique").on(table.handle)
  ]
);

export const socialAccounts = pgTable("social_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => company.id, { onDelete: "cascade" }),
  platform: socialPlatformEnum("platform").notNull(),
  platformAccountId: text("platform_account_id").notNull(),
  username: text("username").notNull(),
  displayName: text("display_name"),
  profilePicture: text("profile_picture"),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at"),
  lastSyncedAt: timestamp("last_synced_at"), // ajout
  status: accountStatusEnum("status").default("active").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const campaign = createTable(
  "campaign",
  (d) => ({
    id: id(),
    name: d.text("name").notNull(),
    userId: d.text("user_id").notNull(), // Créateur de la campagne
    storeId: d.text("store_id").notNull(), // Boutique cible
    description: d.text("description"),
    budget: d.numeric("budget"),
    
    status: campaignStatusEnum("status").default('DRAFT').notNull(),
    scheduleTime: d.timestamp("schedule_time", { withTimezone: true }),
    
    ...createdAt,
    ...updatedAt,
}),
(table) => [
    index("campaign_user_store_idx").on(table.userId, table.storeId),
  ]
);

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => company.id, { onDelete: "cascade" }),
  title: text("title"), // ajout
  content: text("content").notNull(),
  type: postType("type").default("PUBLICATION").notNull(),
  status: postStatusEnum("status").default("draft").notNull(),
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  media: jsonb("media"), // Array of media URLs and metadata
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const postAccounts = pgTable("post_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  accountId: uuid("account_id")
    .notNull()
    .references(() => socialAccounts.id, { onDelete: "cascade" }),
  platformPostId: text("platform_post_id"),
  status: postStatusEnum("status").default("scheduled").notNull(),
  error: text("error"),
  retryCount: integer("retry_count").default(0), // ajout
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analytics = pgTable("analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  postAccountId: uuid("post_account_id")
    .notNull()
    .references(() => postAccounts.id, { onDelete: "cascade" }),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  views: integer("views").default(0),
  rawData: jsonb("raw_data"),
  fetchedAt: timestamp("fetched_at").defaultNow().notNull(),
});

// =====================
// Relations
// =====================
export const companyRelation = relations(company, ({ many }) => ({
  socialAccounts: many(socialAccounts),
  posts: many(posts),
}));

export const socialAccountsRelations = relations(socialAccounts, ({ one, many }) => ({
  user: one(company, {
    fields: [socialAccounts.companyId],
    references: [company.id],
  }),
  postAccounts: many(postAccounts),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  company: one(company, {
    fields: [posts.companyId],
    references: [company.id],
  }),
  postAccounts: many(postAccounts),
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
// export type Company = typeof company.$inferSelect;
// export type NewCompany = typeof company.$inferInsert;

export type SocialAccount = typeof socialAccounts.$inferSelect;
export type NewSocialAccount = typeof socialAccounts.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type PostAccount = typeof postAccounts.$inferSelect;
export type NewPostAccount = typeof postAccounts.$inferInsert;

export type CompanySelect = typeof company.$inferSelect;
export type CompanyInsert = typeof company.$inferInsert;
export type CompanyUpdate = Partial<CompanyInsert>;

export type Company = CompanySelect;
export type NewCompany = CompanyInsert;