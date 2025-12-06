import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "@/shared/services/project/project.service";
import { getCompanyId } from "@/shared/lib/auth-middleware";
import { NewProject } from "@/shared/db/schemas";

/**
 * GET - Récupérer un projet par son ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = await getCompanyId();

    if (!companyId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const project = await ProjectService.getProjectById(
      companyId,
      params.id
    );

    if (!project) {
      return NextResponse.json(
        { error: "Projet non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération du projet:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la récupération du projet" },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Mettre à jour un projet par son ID
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = await getCompanyId();

    if (!companyId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Validation des données
    if (data.name !== undefined && (typeof data.name !== "string" || data.name.trim() === "")) {
      return NextResponse.json(
        { error: "Nom de projet invalide" },
        { status: 400 }
      );
    }

    // Nettoyage des données
    const updateData: Partial<NewProject> = {};
    if (data.name) updateData.name = data.name.trim();
    if (data.goals !== undefined) updateData.goals = data.goals?.trim() || null;
    if (data.description !== undefined) updateData.description = data.description?.trim() || null;

    const updatedProject = await ProjectService.updateProject(
      companyId,
      params.id,
      updateData
    );

    return NextResponse.json({ project: updatedProject }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du projet:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }

    if (error instanceof Error && error.message.includes("non trouvé")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du projet" },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Supprimer un projet par son ID
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = await getCompanyId();

    if (!companyId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    await ProjectService.deleteProject(companyId, params.id);

    return NextResponse.json(
      { message: "Projet supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression du projet:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }

    if (error instanceof Error && error.message.includes("non trouvé")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la suppression du projet" },
      { status: 500 }
    );
  }
}