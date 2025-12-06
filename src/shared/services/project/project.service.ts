import { ProjectRepo } from "@/server/project/project.repo";
import { NewProject, Project } from "@/shared/db/schemas";
import { buildUserAbility } from "@/shared/lib/permissions/permission_ability";
import { subject } from '@casl/ability';

export const ProjectService = {
  /**
   * Créer un projet
   */
  async createProject(companyId: string, data: NewProject): Promise<Project> {
    const ability = await buildUserAbility(companyId);

    if (!ability.can("create", subject("project", {}))) {
      throw new Error("Unauthorized: Vous n'avez pas la permission de créer un projet");
    }

    const [project] = await ProjectRepo.create(data);

    if (!project) throw new Error("Erreur lors de la création du projet");
    return project;
  },

  /**
   * Récupérer un projet par son id
   */
  async getProjectById(companyId: string, projectId: string): Promise<Project | null> {
    const [project] = await ProjectRepo.findById(projectId);
    if (!project) return null;

    const ability = await buildUserAbility(companyId);
    if (!ability.can("view", subject("project", {}))) {
      throw new Error("Unauthorized: Vous n'avez pas la permission de voir ce projet");
    }

    // Vérifier que le projet appartient bien à la company
    if (project.companyId !== companyId) {
      throw new Error("Unauthorized: Ce projet n'appartient pas à votre entreprise");
    }

    return project;
  },

  /**
   * Récupérer tous les projets d'une entreprise
   */
  async getAllProjects(companyId: string): Promise<Project[]> {
    const ability = await buildUserAbility(companyId);
    if (!ability.can("view", subject("project", {}))) {
      throw new Error("Unauthorized: Vous n'avez pas la permission de voir les projets");
    }

    return ProjectRepo.findByCompanyId(companyId);
  },

  /**
   * Mettre à jour un projet
   */
  async updateProject(
    companyId: string,
    projectId: string,
    data: Partial<NewProject>
  ): Promise<Project> {
    const [project] = await ProjectRepo.findById(projectId);
    if (!project) throw new Error("Projet non trouvé");

    // Vérifier que le projet appartient bien à la company
    if (project.companyId !== companyId) {
      throw new Error("Unauthorized: Ce projet n'appartient pas à votre entreprise");
    }

    const ability = await buildUserAbility(companyId);
    if (!ability.can("update", subject("project", {}))) {
      throw new Error("Unauthorized: Vous n'avez pas la permission de modifier ce projet");
    }

    // Ajout automatique de updatedAt
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const [updatedProject] = await ProjectRepo.update(projectId, updateData);
    if (!updatedProject) throw new Error("Erreur lors de la mise à jour du projet");

    return updatedProject;
  },

  /**
   * Supprimer un projet
   */
  async deleteProject(companyId: string, projectId: string): Promise<Project> {
    const [project] = await ProjectRepo.findById(projectId);
    if (!project) throw new Error("Projet non trouvé");

    // Vérifier que le projet appartient bien à la company
    if (project.companyId !== companyId) {
      throw new Error("Unauthorized: Ce projet n'appartient pas à votre entreprise");
    }

    const ability = await buildUserAbility(companyId);
    if (!ability.can("delete", subject("project", {}))) {
      throw new Error("Unauthorized: Vous n'avez pas la permission de supprimer ce projet");
    }

    const [deletedProject] = await ProjectRepo.delete(projectId);
    if (!deletedProject) throw new Error("Erreur lors de la suppression du projet");

    return deletedProject;
  }
};