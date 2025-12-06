import { projectService } from "@/entities/project";
import { requireAuth } from "@/shared/lib";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET - Récupérer tous les projets de l'entreprise
 */
export async function GET() {
  try {
    const company = await requireAuth();

    if (!company) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const projects = await projectService.findAll(company.id);

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Erreur lors de la récupération des projets" },
      { status: 500 }
    );
  }
}

/**
 * POST - Créer un nouveau projet
 */
export async function POST(request: NextRequest) {
  try {
    const company = await requireAuth();

    if (!company) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const data = await request.json();

    // Validation des données
    if (
      !data.name ||
      typeof data.name !== "string" ||
      data.name.trim() === ""
    ) {
      return NextResponse.json(
        { error: "Nom de projet invalide" },
        { status: 400 }
      );
    }

    // Nettoyage et préparation des données
    const projectData = {
      name: data.name.trim(),
      goals: data.goals?.trim() || null,
      description: data.description?.trim() || null,
      companyId: company.id,
    };

    const newProject = await projectService.create(company.id, projectData);

    return NextResponse.json({ project: newProject }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du projet:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Erreur lors de la création du projet" },
      { status: 500 }
    );
  }
}
