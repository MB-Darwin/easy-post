/**
 * Company Service Usage Examples
 * Demonstrates how to use the CompanyService with various queries
 */

import { companyService } from "@/shared/services/database";
import type { NewCompany } from "@/shared/db/schemas/company.schema";

/**
 * Example 1: Create a new company
 */
export async function exampleCreateCompany() {
  const newCompanyData: NewCompany = {
    id: "company_123",
    name: "Acme Corporation",
    handle: "acme-corp",
    description: "A great company",
    logoUrl: "https://example.com/logo.png",
    accessToken: "token_xyz",
    refreshToken: "refresh_xyz",
    accessTokenExpiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour from now
    metadata: {
      industry: "Technology",
      employeeCount: 100,
    },
  };

  const company = await companyService.create(newCompanyData);
  console.log("Created company:", company);
  return company;
}

/**
 * Example 2: Upsert (create or update) a company
 */
export async function exampleUpsertCompany() {
  const companyData: NewCompany = {
    id: "company_123",
    name: "Acme Corporation Updated",
    handle: "acme-corp",
    description: "An updated description",
    accessToken: "new_token_xyz",
  };

  const company = await companyService.upsert(companyData);
  console.log("Upserted company:", company);
  return company;
}

/**
 * Example 3: Find company by ID
 */
export async function exampleFindCompanyById(id: string) {
  const company = await companyService.findById(id);

  if (!company) {
    console.log("Company not found");
    return null;
  }

  console.log("Found company:", company);
  return company;
}

/**
 * Example 4: Search companies by name
 */
export async function exampleSearchCompanies(searchTerm: string) {
  const companies = await companyService.searchByName(searchTerm);
  console.log(`Found ${companies.length} companies matching "${searchTerm}"`);
  return companies;
}

/**
 * Example 5: Get all companies with pagination
 */
export async function exampleGetAllCompanies() {
  const companies = await companyService.findAll({
    limit: 10,
    offset: 0,
    orderBy: "createdAt",
    order: "desc",
  });

  const total = await companyService.count();
  console.log(`Showing ${companies.length} of ${total} companies`);
  return { companies, total };
}

/**
 * Example 6: Update company tokens
 */
export async function exampleUpdateTokens(companyId: string) {
  const company = await companyService.updateTokens(companyId, {
    accessToken: "new_access_token",
    refreshToken: "new_refresh_token",
    accessTokenExpiresAt: new Date(Date.now() + 3600 * 1000),
    refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000), // 7 days
  });

  console.log("Updated tokens for company:", company);
  return company;
}

/**
 * Example 7: Update company metadata
 */
export async function exampleUpdateMetadata(companyId: string) {
  const company = await companyService.updateMetadata(companyId, {
    lastSync: new Date().toISOString(),
    features: ["feature1", "feature2"],
  });

  console.log("Updated metadata:", company?.metadata);
  return company;
}

/**
 * Example 8: Find companies with expired tokens
 */
export async function exampleFindExpiredTokens() {
  const companies = await companyService.findExpiredTokens();
  console.log(`Found ${companies.length} companies with expired tokens`);

  // Optionally refresh tokens for these companies
  for (const company of companies) {
    console.log(`Company ${company.name} needs token refresh`);
  }

  return companies;
}

/**
 * Example 9: Get recently updated companies
 */
export async function exampleGetRecentlyUpdated() {
  const companies = await companyService.findRecentlyUpdated(24); // Last 24 hours
  console.log(
    `Found ${companies.length} companies updated in the last 24 hours`
  );
  return companies;
}

/**
 * Example 10: Check if company exists
 */
export async function exampleCheckExists(companyId: string) {
  const exists = await companyService.exists(companyId);
  console.log(`Company ${companyId} exists:`, exists);
  return exists;
}

/**
 * Example 11: Get company with token status
 */
export async function exampleGetWithTokenStatus(companyId: string) {
  const company = await companyService.getWithTokenStatus(companyId);

  if (!company) {
    console.log("Company not found");
    return null;
  }

  console.log(
    `Company ${company.name} token is ${
      company.isTokenValid ? "valid" : "expired"
    }`
  );
  return company;
}

/**
 * Example 12: Bulk create companies
 */
export async function exampleBulkCreate() {
  const companiesData: NewCompany[] = [
    {
      id: "company_1",
      name: "Company One",
      handle: "company-one",
    },
    {
      id: "company_2",
      name: "Company Two",
      handle: "company-two",
    },
    {
      id: "company_3",
      name: "Company Three",
      handle: "company-three",
    },
  ];

  const companies = await companyService.bulkCreate(companiesData);
  console.log(`Created ${companies.length} companies`);
  return companies;
}

/**
 * Example 13: Delete a company
 */
export async function exampleDeleteCompany(companyId: string) {
  const deletedCompany = await companyService.delete(companyId);

  if (!deletedCompany) {
    console.log("Company not found");
    return null;
  }

  console.log("Deleted company:", deletedCompany.name);
  return deletedCompany;
}

/**
 * Example workflow: Complete company lifecycle
 */
export async function exampleCompleteWorkflow() {
  // 1. Create a company
  const newCompany = await companyService.create({
    id: "workflow_company",
    name: "Workflow Test Company",
    handle: "workflow-test",
    accessToken: "initial_token",
  });
  console.log("Step 1: Created company", newCompany.id);

  // 2. Update the company
  const updated = await companyService.update(newCompany.id, {
    description: "Updated description",
  });
  console.log("Step 2: Updated company", updated?.description);

  // 3. Update tokens
  const withTokens = await companyService.updateTokens(newCompany.id, {
    accessToken: "new_token",
    accessTokenExpiresAt: new Date(Date.now() + 3600 * 1000),
  });
  console.log("Step 3: Updated tokens", withTokens?.accessToken?.slice(0, 10));

  // 4. Check token status
  const withStatus = await companyService.getWithTokenStatus(newCompany.id);
  console.log("Step 4: Token valid?", withStatus?.isTokenValid);

  // 5. Update metadata
  await companyService.updateMetadata(newCompany.id, {
    workflowTest: true,
    completedAt: new Date().toISOString(),
  });
  console.log("Step 5: Updated metadata");

  // 6. Delete the company
  await companyService.delete(newCompany.id);
  console.log("Step 6: Deleted company");
}
