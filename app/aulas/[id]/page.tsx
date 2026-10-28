
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AgendarForm from "./agendar-form";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DetalhesAulaPage({ params }: Props) {
  const { id } = await params;

  const [aula, session] = await Promise.all([
    prisma.aula.findUnique({
      where: { id },
      include: {
        professor: {
          select: { name: true },
        },
      },
    }),
    auth.api.getSession({
      headers: await headers(),
    }),
  ]);

  if (!aula) {
    notFound();
  }

  const minhaAula = session?.user.id === aula.professorId;

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-3xl rounded-xl border bg-white p-8 shadow-sm">
        <Link
          href="/aulas"
          className="text-sm font-semibold text-blue-700 hover:underline"
        >
          ← Voltar ao catálogo
        </Link>

        <p className="mt-8 text-sm font-semibold text-blue-700">
          {aula.categoria}
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          {aula.titulo}
        </h1>

        <p className="mt-6 whitespace-pre-wrap leading-relaxed text-gray-700">
          {aula.descricao}
        </p>

        <p className="mt-6 text-gray-600">
          Professor: {aula.professor.name}
        </p>

        <p className="mt-3 text-2xl font-bold">
          R$ {Number(aula.preco).toFixed(2).replace(".", ",")}
        </p>

        {minhaAula ? (
          <p className="mt-8 rounded-lg bg-gray-100 p-4 text-gray-700">
            Esta é sua aula. Você não pode agendá-la para si mesmo.
          </p>
        ) : session ? (
          <AgendarForm aulaId={aula.id} />
        ) : (
          <div className="mt-8">
            <p className="text-gray-600">
              Entre na sua conta para agendar esta aula.
            </p>

            <Link
              href="/login"
              className="mt-4 inline-block rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
            >
              Entrar para agendar
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
