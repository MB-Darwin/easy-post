/*

app/api/
  auth/
    status/route.ts    ← Endpoints API
    callback/route.ts  ← Endpoints API
  workspaces/
    route.ts           ← GET (list) + POST (create)
    [id]/route.ts      ← GET (one) + PATCH + DELETE

routes for single category by ID

*/

import { NextRequest, NextResponse } from "next/server";
import { NewCategory } from "@/shared/db/schemas";
import { categoryService } from "@/entities/category";
import { isAuthenticated, requireAuth } from "@/shared/lib";
// GET - Récupérer une catégorie par son ID
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await categoryService.findById(params.id);

    if (!category) {
      return NextResponse.json(
        { error: "Catégorie non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({ category }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de la catégorie:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Erreur lors de la récupération de la catégorie" },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour une catégorie par son ID
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isLogged = await isAuthenticated();

    if (!isLogged) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const data = await request.json();

    // Validation des données
    if (
      data.name !== undefined &&
      (typeof data.name !== "string" || data.name.trim() === "")
    ) {
      return NextResponse.json(
        { error: "Nom de catégorie invalide" },
        { status: 400 }
      );
    }

    if (
      data.description !== undefined &&
      (typeof data.description !== "string" || data.description.trim() === "")
    ) {
      return NextResponse.json(
        { error: "Description de catégorie invalide" },
        { status: 400 }
      );
    }

    // Nettoyage des données
    const updateData: Partial<NewCategory> = {};
    if (data.name) updateData.name = data.name.trim();
    if (data.description) updateData.description = data.description.trim();

    const updatedCategory = await categoryService.update(params.id, updateData);

    return NextResponse.json({ category: updatedCategory }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la catégorie:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    if (error instanceof Error && error.message.includes("non trouvée")) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la catégorie" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une catégorie par son ID
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isLogged = await isAuthenticated();

    if (!isLogged) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    await categoryService.delete(params.id);

    return NextResponse.json(
      { message: "Catégorie supprimée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de la catégorie:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    if (error instanceof Error && error.message.includes("non trouvée")) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Erreur lors de la suppression de la catégorie" },
      { status: 500 }
    );
  }
}
