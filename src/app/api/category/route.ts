/*
Project structure:

app/api/
  category/
    route.ts           ← GET (list) + POST (create)
    [id]/route.ts      ← GET (one) + PATCH + DELETE

Routes for list and post categories
*/

import { categoryService } from "@/entities/category";
import { requireAuth } from "@/shared/lib";
import { NextRequest, NextResponse } from "next/server";

// GET - Récupérer une catégorie par son ID
export async function GET() {
  try {
    const categories = await categoryService.findAll();

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Erreur lors de la récupération des catégories" },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle catégorie
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.name || typeof data.name !== "string") {
      return NextResponse.json(
        { error: "Nom de catégorie invalide" },
        { status: 400 }
      );
    }

    const categoryData = {
      ...data,
    };

    const newCategory = await categoryService.create(categoryData);

    return NextResponse.json({ category: newCategory }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Erreur lors de la création de la catégorie" },
      { status: 500 }
    );
  }
}
