import { pgEnum, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
// export const createTable = pgTableCreator((name) => `tb_${name}`); // Shorter prefix
export const id = () => uuid('id').primaryKey().defaultRandom();
export const createdAt = timestamp('created_at', { withTimezone: true }).notNull().defaultNow();
export const updatedAt = timestamp('updated_at', { withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

export function createPgEnum<T extends Record<string, string>>(name: string, enumObj: T) {
  const values = Object.values(enumObj);
  return pgEnum(name, [values[0], ...values.slice(1)] as [string, ...string[]]);
}
