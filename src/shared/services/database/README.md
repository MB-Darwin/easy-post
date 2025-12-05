# Company Database Service

A comprehensive database service for managing company data using Drizzle ORM.

## Overview

The `CompanyService` provides a complete set of methods for CRUD operations and advanced queries on company data. It uses Drizzle ORM with PostgreSQL for type-safe database operations.

## Installation

The service is available as a singleton instance:

```typescript
import { companyService } from "@/shared/services/database";
```

## Database Schema

The company table includes the following fields:

- `id` - Primary key (string)
- `name` - Company name (required)
- `handle` - Unique handle/slug
- `description` - Company description
- `logoUrl` - URL to company logo
- `accessToken` - OAuth access token
- `refreshToken` - OAuth refresh token
- `accessTokenExpiresAt` - Access token expiration timestamp
- `refreshTokenExpiresAt` - Refresh token expiration timestamp
- `metadata` - JSONB field for additional data
- `createdAt` - Creation timestamp (auto-generated)
- `updatedAt` - Last update timestamp (auto-updated)

## API Reference

### Create Operations

#### `create(data: NewCompany): Promise<Company>`

Create a new company record.

```typescript
const company = await companyService.create({
  id: "company_123",
  name: "Acme Corp",
  handle: "acme",
  accessToken: "token_xyz",
});
```

#### `upsert(data: NewCompany): Promise<Company>`

Create a new company or update if it already exists (based on ID).

```typescript
const company = await companyService.upsert({
  id: "company_123",
  name: "Acme Corporation",
  description: "Updated description",
});
```

#### `bulkCreate(companies: NewCompany[]): Promise<Company[]>`

Create multiple companies in a single operation.

```typescript
const companies = await companyService.bulkCreate([
  { id: "1", name: "Company One" },
  { id: "2", name: "Company Two" },
]);
```

### Read Operations

#### `findById(id: string): Promise<Company | undefined>`

Find a company by its ID.

```typescript
const company = await companyService.findById("company_123");
```

#### `findByHandle(handle: string): Promise<Company | undefined>`

Find a company by its handle.

```typescript
const company = await companyService.findByHandle("acme");
```

#### `findByName(name: string): Promise<Company[]>`

Find companies with an exact name match.

```typescript
const companies = await companyService.findByName("Acme Corp");
```

#### `searchByName(searchTerm: string): Promise<Company[]>`

Search companies by partial name match.

```typescript
const companies = await companyService.searchByName("acme");
```

#### `findAll(options?): Promise<Company[]>`

Get all companies with pagination and sorting.

```typescript
const companies = await companyService.findAll({
  limit: 20,
  offset: 0,
  orderBy: "createdAt",
  order: "desc",
});
```

Options:

- `limit` - Number of records to return (default: 50)
- `offset` - Number of records to skip (default: 0)
- `orderBy` - Field to sort by: "name" | "createdAt" | "updatedAt" (default: "createdAt")
- `order` - Sort direction: "asc" | "desc" (default: "desc")

#### `count(): Promise<number>`

Get the total number of companies.

```typescript
const total = await companyService.count();
```

#### `exists(id: string): Promise<boolean>`

Check if a company exists.

```typescript
const exists = await companyService.exists("company_123");
```

#### `getWithTokenStatus(id: string): Promise<Company & { isTokenValid: boolean } | undefined>`

Get a company with token validity check.

```typescript
const company = await companyService.getWithTokenStatus("company_123");
if (company && !company.isTokenValid) {
  // Refresh token
}
```

### Update Operations

#### `update(id: string, data: Partial<NewCompany>): Promise<Company | undefined>`

Update a company's fields.

```typescript
const company = await companyService.update("company_123", {
  name: "New Name",
  description: "New description",
});
```

#### `updateTokens(id: string, tokens): Promise<Company | undefined>`

Update OAuth tokens for a company.

```typescript
const company = await companyService.updateTokens("company_123", {
  accessToken: "new_token",
  refreshToken: "new_refresh",
  accessTokenExpiresAt: new Date(Date.now() + 3600 * 1000),
  refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
});
```

#### `updateMetadata(id: string, metadata: Record<string, unknown>): Promise<Company | undefined>`

Update or merge metadata (existing metadata is preserved and merged).

```typescript
const company = await companyService.updateMetadata("company_123", {
  lastSync: new Date().toISOString(),
  customField: "value",
});
```

### Delete Operations

#### `delete(id: string): Promise<Company | undefined>`

Delete a company by ID.

```typescript
const deletedCompany = await companyService.delete("company_123");
```

### Advanced Queries

#### `findExpiredTokens(): Promise<Company[]>`

Find all companies with expired access tokens.

```typescript
const expiredCompanies = await companyService.findExpiredTokens();
for (const company of expiredCompanies) {
  // Refresh tokens
}
```

#### `findByDateRange(startDate: Date, endDate: Date): Promise<Company[]>`

Find companies created within a specific date range.

```typescript
const start = new Date("2024-01-01");
const end = new Date("2024-12-31");
const companies = await companyService.findByDateRange(start, end);
```

#### `findRecentlyUpdated(hours?: number): Promise<Company[]>`

Find companies updated within the last N hours (default: 24).

```typescript
const recentCompanies = await companyService.findRecentlyUpdated(24);
```

## Type Definitions

```typescript
// Company type (database record)
type Company = {
  id: string;
  name: string;
  handle: string | null;
  description: string | null;
  logoUrl: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: Date | null;
  refreshTokenExpiresAt: Date | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
};

// New company type (for inserts)
type NewCompany = {
  id: string;
  name: string;
  handle?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  accessTokenExpiresAt?: Date | null;
  refreshTokenExpiresAt?: Date | null;
  metadata?: Record<string, unknown> | null;
};
```

## Common Patterns

### OAuth Token Management

```typescript
// Store company after OAuth callback
async function handleOAuthCallback(companyData) {
  const company = await companyService.upsert({
    id: companyData.id,
    name: companyData.name,
    accessToken: companyData.access_token,
    refreshToken: companyData.refresh_token,
    accessTokenExpiresAt: new Date(Date.now() + 3600 * 1000),
  });
  return company;
}

// Check and refresh expired tokens
async function refreshExpiredTokens() {
  const expired = await companyService.findExpiredTokens();

  for (const company of expired) {
    const newTokens = await oauthService.refreshToken(company.refreshToken!);
    await companyService.updateTokens(company.id, {
      accessToken: newTokens.access_token,
      accessTokenExpiresAt: new Date(Date.now() + 3600 * 1000),
    });
  }
}
```

### Pagination

```typescript
async function getPaginatedCompanies(page: number, pageSize: number) {
  const offset = (page - 1) * pageSize;

  const [companies, total] = await Promise.all([
    companyService.findAll({ limit: pageSize, offset }),
    companyService.count(),
  ]);

  return {
    data: companies,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
```

### Search and Filter

```typescript
async function searchCompanies(query: string) {
  // Try exact match first
  const exactMatch = await companyService.findByHandle(query);
  if (exactMatch) return [exactMatch];

  // Fall back to partial name search
  return await companyService.searchByName(query);
}
```

## Error Handling

All methods that return a single record will return `undefined` if not found. Methods that create records will throw an error if the operation fails.

```typescript
// Handle not found
const company = await companyService.findById("invalid_id");
if (!company) {
  throw new Error("Company not found");
}

// Handle create errors
try {
  const company = await companyService.create(data);
} catch (error) {
  console.error("Failed to create company:", error);
}
```

## Migration

To use this service, you need to run the database migration to create the company table:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

## Examples

See [company-service-usage.example.ts](../../../features/company/examples/company-service-usage.example.ts) for comprehensive usage examples.
