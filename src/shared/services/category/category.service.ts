import { CategoryRepo } from "@/server/category/category.repo";
import { NewCategory, Category } from "@/shared/db/schemas";
import { buildUserAbility } from "@/shared/lib/permissions/permission_ability";
import { subject } from '@casl/ability';

export const CategoryService = {
  // Créer une catégorie
  async createCategory(userId: string, data: NewCategory): Promise<Category> {
    const ability = await buildUserAbility(userId);

    if (!ability.can("create", subject("category", {}))) {
      throw new Error("Unauthorized: Vous n'avez pas la permission de créer une catégorie");
    }

    const [category] = await CategoryRepo.create(data);

    if (!category) throw new Error("Erreur lors de la création de la catégorie");
    return category;
  },

  // Récupérer une catégorie par son id
  async getCategoryById(userId: string, categoryId: string): Promise<Category | null> {
    const [category] = await CategoryRepo.findById(categoryId);
    if (!category) return null;

    const ability = await buildUserAbility(userId);
    if (!ability.can("view", subject("category", {}))) {
      throw new Error("Unauthorized: Vous n'avez pas la permission de voir cette catégorie");
    }

    return category;
  },

  // Récupérer toutes les catégories
  async getAllCategories(userId: string): Promise<Category[]> {   
    const ability = await buildUserAbility(userId);
    if (!ability.can("view", subject("category", {}))) {
      throw new Error("Unauthorized: Vous n'avez pas la permission de voir les catégories");
    }

    return CategoryRepo.findAll();
  },
    
  // Mettre à jour une catégorie
  async updateCategory(
    userId: string,
    categoryId: string,
    data: Partial<NewCategory>
  ): Promise<Category> {
    const [category] = await CategoryRepo.findById(categoryId);
    if (!category) throw new Error("Catégorie non trouvée");
    
    const ability = await buildUserAbility(userId);
    if (!ability.can("update", subject("category", {}))) {
      throw new Error("Unauthorized: Vous n'avez pas la permission de modifier cette catégorie");
    }

    // Ajout automatique de updatedAt
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const [updatedCategory] = await CategoryRepo.update(categoryId, updateData);
    if (!updatedCategory) throw new Error("Erreur lors de la mise à jour de la catégorie");
    
    return updatedCategory;
  },

  // Supprimer une catégorie
  async deleteCategory(userId: string, categoryId: string): Promise<Category> {
    const [category] = await CategoryRepo.findById(categoryId);
    if (!category) throw new Error("Catégorie non trouvée");

    const ability = await buildUserAbility(userId);
    if (!ability.can("delete", subject("category", {}))) {
      throw new Error("Unauthorized: Vous n'avez pas la permission de supprimer cette catégorie");
    }

    const [deletedCategory] = await CategoryRepo.delete(categoryId);
    if (!deletedCategory) throw new Error("Erreur lors de la suppression de la catégorie");

    return deletedCategory;
  }
};