import { Ability, AbilityBuilder, type AbilityClass } from "@casl/ability";

export type Actions = "view" | "manage";
export type Subjects =
  | "Playground"
  | "Models"
  | "Documentation"
  | "Settings"
  | "Project"
  | "all";

export type AppAbility = Ability<[Actions, Subjects]>;

export interface AppUser {
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "editor" | "viewer";
}

export function defineAbilityFor(user: AppUser): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(
    Ability as AbilityClass<AppAbility>
  );

  switch (user.role) {
    case "admin":
      can("manage", "all");
      break;
    case "editor":
      can("view", "Playground");
      can("view", "Models");
      can("view", "Documentation");
      can("view", "Project");
      break;
    case "viewer":
    default:
      can("view", "Playground");
      can("view", "Documentation");
      break;
  }

  return build();
}
