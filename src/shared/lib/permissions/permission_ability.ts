/*


*/

// permissions_ability.ts
import { AbilityBuilder, Ability } from '@casl/ability';
import { getUserPermissions, Permission } from './permissions_back';

// Build CASL Ability for a given company/user
export async function buildUserAbility(compagyId: string) {
  // Fetch permissions from the DB
  const userPermissions: Permission[] = await getUserPermissions(compagyId);

  // Create an AbilityBuilder
  const { can, build } = new AbilityBuilder(Ability);

  // Add rules to the Ability
  userPermissions.forEach(p => {
    can(p.action, p.subject, p.condition);
  });

  // Return the Ability object
  return build();
}
