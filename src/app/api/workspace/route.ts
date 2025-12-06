/*
Project structure:

app/api/
  workspaces/
    route.ts           ← GET (list) + POST (create)
    [id]/route.ts      ← GET (one) + PATCH + DELETE

Routes for list and post workspaces

*/

import { workspaceService } from "@/entities/workspace/services";
import { requireAuth } from "@/shared/lib";
import { NextRequest, NextResponse } from "next/server";

// GET - Récupérer tous les workspaces d'une company
export async function GET() {
  try {
    const company = await requireAuth();

    if (!company) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const workspaces = await workspaceService.findByCompany(
      company.id,
      company.id
    );

    return NextResponse.json({ workspaces }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des workspaces:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Erreur lors de la récupération des workspaces" },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau workspace
export async function POST(request: NextRequest) {
  try {
    const company = await requireAuth();

    if (!company) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();

    // Validation basique
    if (!body.name) {
      return NextResponse.json({ error: "name est requis" }, { status: 400 });
    }

    // S'assurer que le workspace est créé pour la company de l'utilisateur connecté
    const workspaceData = {
      ...body,
      company: company,
    };

    const workspace = await workspaceService.create(company.id, workspaceData);

    return NextResponse.json({ workspace }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du workspace:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Erreur lors de la création du workspace" },
      { status: 500 }
    );
  }
}
