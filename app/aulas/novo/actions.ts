
"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const aulaSchema = z.object({
  titulo: z.string().trim().min(3, "O título deve ter pelo menos 3 caracteres."),
  descricao: z.string().trim().min(10, "A descrição deve ter pelo menos 10 caracteres."),
  categoria: z.enum(["Idiomas", "Música", "Reforço escolar"]),
  preco: z.coerce.number().positive("O preço deve ser maior que zero."),
});

const tiposPermitidos = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export async function cadastrarAula(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const resultado = aulaSchema.safeParse({
    titulo: formData.get("titulo"),
    descricao: formData.get("descricao"),
    categoria: formData.get("categoria"),
    preco: formData.get("preco"),
  });

  if (!resultado.success) {
    redirect("/aulas/novo?erro=dados");
  }

  const arquivo = formData.get("imagem");
  let imagem: string | null = null;

  if (arquivo instanceof File && arquivo.size > 0) {
    if (!tiposPermitidos.includes(arquivo.type)) {
      redirect("/aulas/novo?erro=imagem_tipo");
    }

    if (arquivo.size > 2 * 1024 * 1024) {
      redirect("/aulas/novo?erro=imagem_tamanho");
    }

    try {
      const blob = await put(
        `aulas/${crypto.randomUUID()}-${arquivo.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
        arquivo,
        {
          access: "public",
          addRandomSuffix: true,
        }
      );

      imagem = blob.url;
    } catch (erro) {
      console.error("ERRO AO ENVIAR IMAGEM PARA O BLOB:", erro);
      throw erro;
    }
  }

  await prisma.aula.create({
    data: {
      ...resultado.data,
      imagem,
      professorId: session.user.id,
    },
  });

  redirect("/aulas");
}
