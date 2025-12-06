import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { getUserPermissions, Permission } from "./permissions_back";

// Build CASL Ability for a given company/user
export async function buildUserAbility(compagyId: string) {
  // Fetch permissions from the DB
  const userPermissions: Permission[] = await getUserPermissions(compagyId);

  // Create an AbilityBuilder with createMongoAbility
  const { can, build } = new AbilityBuilder(createMongoAbility);

  // Add rules to the Ability
  userPermissions.forEach((p) => {
    can(p.action, p.subject, p.condition);
  });

  // Return the Ability object
  return build();
}
