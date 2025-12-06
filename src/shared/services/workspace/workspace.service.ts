import { WorkspaceRepo } from "../../../server/workspace/workspace.repo";
import { NewWorkspace, Workspace } from "@/shared/db/schemas";
import { buildUserAbility } from "@/shared/lib/permissions/permission_ability";
import { subject } from '@casl/ability';

export const WorkspaceService = {
  // Créer un workspace
  async createWorkspace(userId: string, data: NewWorkspace): Promise<Workspace> {
    const ability = await buildUserAbility(userId);

    // Utiliser subject() pour créer un objet typé
    if (!ability.can("create", subject("workspace", { companyId: data.companyId }))) {
      throw new Error("Unauthorized: Vous n'avez pas la permission de créer un workspace");
    }

    const [workspace] = await WorkspaceRepo.create(data);

    if (!workspace) throw new Error("Erreur lors de la création du workspace");
    return workspace;
  },

  // Récupérer un workspace par son id
  async getWorkspaceById(userId: string, workspaceId: string): Promise<Workspace | null> {
    const [workspace] = await WorkspaceRepo.findById(workspaceId);
    if (!workspace) return null;

    const ability = await buildUserAbility(userId);
    if (!ability.can("view", subject("workspace", { companyId: workspace.companyId }))) {
      throw new Error("Unauthorized: Vous n'avez pas la permission de voir ce workspace");
    }

    return workspace;
  },

  // Récupérer tous les workspaces d'une company
  async getWorkspacesByCompany(userId: string, companyId: string): Promise<Workspace[]> {
    const ability = await buildUserAbility(userId);
    if (!ability.can("view", subject("workspace", { companyId }))) {
      throw new Error("Unauthorized: Vous n'avez pas la permission de voir ces workspaces");
    }

    return WorkspaceRepo.findByCompanyId(companyId);
  },

  // Mettre à jour un workspace
  async updateWorkspace(
    userId: string,
    workspaceId: string,
    data: Partial<NewWorkspace>
  ): Promise<Workspace> {
    const [workspace] = await WorkspaceRepo.findById(workspaceId);
    if (!workspace) throw new Error("Workspace non trouvé");

    const ability = await buildUserAbility(userId);
    if (!ability.can("update", subject("workspace", { companyId: workspace.companyId }))) {
      throw new Error("Unauthorized: Vous n'avez pas la permission de modifier ce workspace");
    }

    const [updatedWorkspace] = await WorkspaceRepo.update(workspaceId, data);
    if (!updatedWorkspace) throw new Error("Erreur lors de la mise à jour du workspace");

    return updatedWorkspace;
  },

  // Supprimer un workspace
  async deleteWorkspace(userId: string, workspaceId: string): Promise<Workspace> {
    const [workspace] = await WorkspaceRepo.findById(workspaceId);
    if (!workspace) throw new Error("Workspace non trouvé");

    const ability = await buildUserAbility(userId);
    if (!ability.can("delete", subject("workspace", { companyId: workspace.companyId }))) {
      throw new Error("Unauthorized: Vous n'avez pas la permission de supprimer ce workspace");
    }

    const [deletedWorkspace] = await WorkspaceRepo.delete(workspaceId);
    if (!deletedWorkspace) throw new Error("Erreur lors de la suppression du workspace");

    return deletedWorkspace;
  },
};