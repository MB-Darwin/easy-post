// app/(dashboard)/_components/sidebar/ability.ts

import {
  AbilityBuilder,
  createMongoAbility,
  type MongoAbility,
} from "@casl/ability";

export type AppAction = "view" | "manage";
export type AppSubject =
  | "Playground"
  | "Models"
  | "Documentation"
  | "Settings"
  | "Projects"
  | "all";

// Use MongoAbility instead of PureAbility/Ability
export type AppAbility = MongoAbility<[AppAction, AppSubject]>;

export interface AppUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "editor" | "viewer";
}

export function defineAbilityFor(user: AppUser): AppAbility {
  // Use createMongoAbility as the ability factory
  const { can, /* cannot, */ build } = new AbilityBuilder<AppAbility>(
    createMongoAbility
  );

  switch (user.role) {
    case "admin": {
      can("manage", "all");
      break;
    }
    case "editor": {
      can("view", "Playground");
      can("view", "Models");
      can("view", "Documentation");
      can("view", "Settings");
      can("view", "Projects");
      break;
    }
    case "viewer":
    default: {
      can("view", "Playground");
      can("view", "Documentation");
      break;
    }
  }

  return build();
}
