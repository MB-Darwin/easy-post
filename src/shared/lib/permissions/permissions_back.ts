/*
  Retrieves the permissions of a user based on their categories.
  Each category can have multiple permissions associated.
  The go to define permissions structure and fetch companies permissions.
*/

import { db } from '../../db';
import { company, permission } from '@/shared/db/schemas';
import { eq } from 'drizzle-orm';

export interface Permission {
  action: string;
  subject: string;
  condition?: Record<string, unknown>;
}

export async function getUserPermissions(companyId: string): Promise<Permission[]> {
  // 1️⃣ Récupérer l'entreprise pour avoir sa categoryId
  const companyData = await db
    .select({ categoryId: company.categoryId })
    .from(company)
    .where(eq(company.id, companyId));

  if (!companyData || companyData.length === 0 || !companyData[0]?.categoryId) {
    return [];
  }

  const categoryId = companyData[0].categoryId;

  // 2️⃣ Récupérer toutes les permissions liées à cette catégorie
  const categoryPermissions = await db
    .select({ name: permission.name, description: permission.description })
    .from(permission)
    .where(eq(permission.categoryId, categoryId));

  // 3️⃣ Mapper pour CASL / business logic
  return categoryPermissions
    .filter(cp => cp.name) // s'assure que name n'est pas null ou undefined
    .map(cp => {
      const [subject, action] = cp.name!.split('.') as [string, string]; // le "!" dit à TS que name est bien défini
      return {
        subject: subject ?? cp.name,
        action: action ?? 'view',
        condition: {}, // facultatif
      };
    });
}


