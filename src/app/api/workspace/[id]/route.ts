/*

app/api/
  auth/
    status/route.ts    ← Endpoints API
    callback/route.ts  ← Endpoints API
  workspaces/
    route.ts           ← GET (list) + POST (create)
    [id]/route.ts      ← GET (one) + PATCH + DELETE

routes for single workspace by ID

*/
import { workspaceService } from "@/entities/workspace";
import { requireAuth } from "@/shared/lib";
import { NextRequest, NextResponse } from "next/server";

// GET - Récupérer un workspace par son ID
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const company = await requireAuth();

    if (!company) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const workspace = await workspaceService.findById(company.id, params.id);

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ workspace }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération du workspace:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Erreur lors de la récupération du workspace" },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour un workspace
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const company = await requireAuth();

    if (!company) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();

    const workspace = await workspaceService.update(
      company.id,
      params.id,
      body
    );

    return NextResponse.json({ workspace }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du workspace:", error);

    if (error instanceof Error) {
      if (error.message.includes("Unauthorized")) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }

      if (error.message.includes("non trouvé")) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
    }

    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du workspace" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un workspace
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const company = await requireAuth();

    if (!company) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const workspace = await workspaceService.delete(company.id, params.id);

    return NextResponse.json(
      { message: "Workspace supprimé avec succès", workspace },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression du workspace:", error);

    if (error instanceof Error) {
      if (error.message.includes("Unauthorized")) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }

      if (error.message.includes("non trouvé")) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
    }

    return NextResponse.json(
      { error: "Erreur lors de la suppression du workspace" },
      { status: 500 }
    );
  }
}
