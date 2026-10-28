
"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type EstadoEdicaoAula = {
  erro?: string;
};

const aulaSchema = z.object({
  titulo: z.string().trim().min(3).max(100),
  descricao: z.string().trim().min(10),
  categoria: z.enum(["Idiomas", "Música", "Reforço escolar"]),
  preco: z.coerce.number().positive(),
});

const tiposPermitidos = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export async function atualizarAula(
  estadoAnterior: EstadoEdicaoAula,
  formData: FormData
): Promise<EstadoEdicaoAula> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    return { erro: "Identificação da aula inválida." };
  }

  const aula = await prisma.aula.findFirst({
    where: {
      id,
      professorId: session.user.id,
    },
    select: { id: true },
  });

  if (!aula) {
    return { erro: "Aula não encontrada ou você não tem permissão para editá-la." };
  }

  const resultado = aulaSchema.safeParse({
    titulo: formData.get("titulo"),
    descricao: formData.get("descricao"),
    categoria: formData.get("categoria"),
    preco: formData.get("preco"),
  });

  if (!resultado.success) {
    return {
      erro: "Confira os campos. O título precisa ter pelo menos 3 caracteres, a descrição 10 e o preço deve ser positivo.",
    };
  }

  const arquivo = formData.get("imagem");
  let imagem: string | undefined;

  if (arquivo instanceof File && arquivo.size > 0) {
    if (!tiposPermitidos.includes(arquivo.type)) {
      return { erro: "Envie uma imagem JPG, PNG, WEBP ou GIF." };
    }

    if (arquivo.size > 2 * 1024 * 1024) {
      return { erro: "A imagem deve ter no máximo 2 MB." };
    }

    const token = process.env.BLOB_PUBLIC_READ_WRITE_TOKEN;
    const storeId = process.env.BLOB_PUBLIC_STORE_ID;

    if (!token || !storeId) {
      console.error("Token ou ID do Blob público não configurado.");
      return { erro: "O armazenamento de imagens não está configurado." };
    }

    try {
      const nomeArquivo = arquivo.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      );

      const blob = await put(
        `aulas/${crypto.randomUUID()}-${nomeArquivo}`,
        arquivo,
        {
          access: "public",
          addRandomSuffix: true,
          token,
          storeId,
        }
      );

      imagem = blob.url;
    } catch (erro) {
      console.error("ERRO AO ENVIAR IMAGEM:", erro);
      return { erro: "Não foi possível enviar a imagem. Tente novamente." };
    }
  }

  try {
    const atualizacao = await prisma.aula.updateMany({
      where: {
        id,
        professorId: session.user.id,
      },
      data: {
        ...resultado.data,
        ...(imagem ? { imagem } : {}),
      },
    });

    if (atualizacao.count !== 1) {
      return { erro: "A aula não foi encontrada ou você não tem permissão para editá-la." };
    }
  } catch (erro) {
    console.error("ERRO AO ATUALIZAR A AULA:", erro);
    return { erro: "Não foi possível salvar as alterações. Tente novamente." };
  }

  redirect(`/aulas/${id}`);
}
