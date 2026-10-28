
"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type EstadoEdicaoAula = {
  erro?: string;
  valores?: {
    id: string;
    titulo: string;
    descricao: string;
    categoria: string;
    preco: string;
  };
};

const schema = z.object({
  id: z.string().min(1, "Aula inválida."),
  titulo: z.string().trim().min(3, "O título deve ter pelo menos 3 caracteres.").max(100),
  descricao: z.string().trim().min(10, "A descrição deve ter pelo menos 10 caracteres."),
  categoria: z.enum(["Idiomas", "Música", "Reforço escolar"]),
  preco: z.coerce.number().positive("O preço deve ser maior que zero."),
});

export async function atualizarAula(
  _estadoAnterior: EstadoEdicaoAula,
  formData: FormData,
): Promise<EstadoEdicaoAula> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const valores = {
    id: String(formData.get("id") ?? ""),
    titulo: String(formData.get("titulo") ?? ""),
    descricao: String(formData.get("descricao") ?? ""),
    categoria: String(formData.get("categoria") ?? ""),
    preco: String(formData.get("preco") ?? ""),
  };

  const resultado = schema.safeParse(valores);

  if (!resultado.success) {
    return {
      erro: resultado.error.issues[0]?.message ?? "Confira os campos.",
      valores,
    };
  }

  const { id, ...dados } = resultado.data;

  const atualizacao = await prisma.aula.updateMany({
    where: {
      id,
      professorId: session.user.id,
    },
    data: dados,
  });

  if (atualizacao.count === 0) {
    return {
      erro: "Aula não encontrada ou você não tem permissão para editá-la.",
      valores,
    };
  }

  redirect("/aulas");
}
