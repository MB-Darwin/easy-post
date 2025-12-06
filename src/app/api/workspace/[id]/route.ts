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
import { NextRequest, NextResponse } from "next/server";
import { WorkspaceService } from "@/shared/services/workspace/workspace.service";
import { getCompanyId } from "@/shared/lib/auth-middleware";

// GET - Récupérer un workspace par son ID
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

    const workspace = await WorkspaceService.getWorkspaceById(
      companyId,
      params.id
    );

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
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
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
    const companyId = await getCompanyId();
    
    if (!companyId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const workspace = await WorkspaceService.updateWorkspace(
      companyId,
      params.id,
      body
    );

    return NextResponse.json({ workspace }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du workspace:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("Unauthorized")) {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        );
      }
      
      if (error.message.includes("non trouvé")) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
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
    const companyId = await getCompanyId();
    
    if (!companyId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const workspace = await WorkspaceService.deleteWorkspace(
      companyId,
      params.id
    );

    return NextResponse.json(
      { message: "Workspace supprimé avec succès", workspace },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression du workspace:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("Unauthorized")) {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        );
      }
      
      if (error.message.includes("non trouvé")) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Erreur lors de la suppression du workspace" },
      { status: 500 }
    );
  }
}