
"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const aulaSchema = z.object({
  titulo: z.string().trim().min(3, "O título deve ter pelo menos 3 caracteres."),
  descricao: z.string().trim().min(10, "A descrição deve ter pelo menos 10 caracteres."),
  categoria: z.enum(["Idiomas", "Música", "Reforço escolar"]),
  preco: z.coerce.number().positive("O preço deve ser maior que zero."),
});

export async function cadastrarAula(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const resultado = aulaSchema.safeParse({
    titulo: formData.get("titulo"),
    descricao: formData.get("descricao"),
    categoria: formData.get("categoria"),
    preco: formData.get("preco"),
  });

  if (!resultado.success) {
    redirect("/aulas/novo?erro=dados");
  }

  await prisma.aula.create({
    data: {
      ...resultado.data,
      professorId: session.user.id,
    },
  });

  redirect("/aulas");
}
