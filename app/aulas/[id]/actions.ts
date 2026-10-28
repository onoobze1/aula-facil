
"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type EstadoAgendamento = {
  erro?: string;
  data?: string;
};

const schema = z.object({
  aulaId: z.string().min(1, "Aula inválida."),
  data: z.string().min(1, "Escolha a data e o horário."),
});

export async function agendarAula(
  _estadoAnterior: EstadoAgendamento,
  formData: FormData,
): Promise<EstadoAgendamento> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const resultado = schema.safeParse({
    aulaId: formData.get("aulaId"),
    data: formData.get("data"),
  });

  if (!resultado.success) {
    return {
      erro: resultado.error.issues[0]?.message ?? "Confira os dados.",
      data: String(formData.get("data") ?? ""),
    };
  }

  const { aulaId, data } = resultado.data;

  const aula = await prisma.aula.findUnique({
    where: { id: aulaId },
    select: { id: true, professorId: true },
  });

  if (!aula) {
    return {
      erro: "Esta aula não existe mais.",
      data,
    };
  }

  if (aula.professorId === session.user.id) {
    return {
      erro: "Você não pode agendar sua própria aula.",
      data,
    };
  }

  // O formulário utiliza o horário local de Brasília (UTC-3).
  const dataAgendamento = new Date(`${data}:00-03:00`);

  if (
    !Number.isFinite(dataAgendamento.getTime()) ||
    dataAgendamento <= new Date()
  ) {
    return {
      erro: "Escolha uma data e um horário futuros.",
      data,
    };
  }

  await prisma.agendamento.create({
    data: {
      aulaId,
      alunoId: session.user.id,
      data: dataAgendamento,
      status: "PENDENTE",
    },
  });

  redirect("/agendamentos");
}
