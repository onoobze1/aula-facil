
"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function excluirAula(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    throw new Error("ID da aula inválido.");
  }

  const resultado = await prisma.aula.deleteMany({
    where: {
      id,
      professorId: session.user.id,
    },
  });

  if (resultado.count === 0) {
    throw new Error("Aula não encontrada ou você não tem permissão para excluí-la.");
  }

  redirect("/aulas");
}
