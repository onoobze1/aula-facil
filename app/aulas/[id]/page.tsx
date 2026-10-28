
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DetalhesAulaPage({ params }: Props) {
  const { id } = await params;

  const aula = await prisma.aula.findUnique({
    where: { id },
    include: {
      professor: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!aula) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const podeEditar = session?.user.id === aula.professorId;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 text-gray-900 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-xl border bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/aulas"
            className="text-sm font-semibold text-blue-700 hover:underline"
          >
            ← Voltar ao catálogo
          </Link>

          {podeEditar && (
            <Link
              href={`/aulas/${aula.id}/editar`}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Editar aula
            </Link>
          )}
        </div>

        {aula.imagem && (
          <img
            src={aula.imagem}
            alt={`Imagem da aula ${aula.titulo}`}
            className="mt-6 max-h-96 w-full rounded-lg object-cover"
          />
        )}

        <p className="mt-8 text-sm font-semibold text-blue-700">
          {aula.categoria}
        </p>

        <h1 className="mt-2 text-3xl font-bold">{aula.titulo}</h1>

        <p className="mt-6 whitespace-pre-wrap leading-relaxed text-gray-700">
          {aula.descricao}
        </p>

        <p className="mt-6 text-gray-600">
          Professor: {aula.professor.name}
        </p>

        <p className="mt-3 text-2xl font-bold">
          R$ {Number(aula.preco).toFixed(2).replace(".", ",")}
        </p>
      </div>
    </main>
  );
}
