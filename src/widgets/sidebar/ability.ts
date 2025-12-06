// app/(dashboard)/_components/sidebar/ability.ts

import {
  AbilityBuilder,
  createMongoAbility,
  type MongoAbility,
} from "@casl/ability";

export type AppAction = "view" | "create" | "edit" | "delete" | "manage";

export type AppSubject =
  | "Console"
  | "Posts"
  | "Settings"
  | "Documentation"
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
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createMongoAbility
  );

  switch (user.role) {
    case "admin": {
      // Admin has full access to everything
      can("manage", "all");
      break;
    }

    case "editor": {
      // Console access
      can("view", "Console");

      // Posts - full CRUD access
      can("view", "Posts");
      can("create", "Posts");
      can("edit", "Posts");
      can("delete", "Posts");

      // Settings - view and edit only
      can("view", "Settings");
      can("edit", "Settings");

      // Documentation - view only
      can("view", "Documentation");

      // Projects - view and edit
      can("view", "Projects");
      can("edit", "Projects");
      break;
    }

    case "viewer":
    default: {
      // Viewer has read-only access to limited sections
      can("view", "Console");
      can("view", "Posts");
      can("view", "Documentation");

      // Explicitly deny settings access for viewers
      cannot("view", "Settings");
      break;
    }
  }

  return build();
}
