import { NextResponse } from "next/server";

const API_URL =
  process.env.CERAPRO_API_URL || "https://cerapro-production.up.railway.app";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const superAdminToken = process.env.SUPER_ADMIN_DELETE_TOKEN;

  if (!superAdminToken) {
    return NextResponse.json(
      {
        success: false,
        message: "Token super admin manquant côté serveur admin.",
      },
      { status: 500 },
    );
  }

  const response = await fetch(`${API_URL}/admin/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-super-admin-token": superAdminToken,
    },
  });

  const result = await response.json();

  return NextResponse.json(result, {
    status: response.status,
  });
}