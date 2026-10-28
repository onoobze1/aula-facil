
import Link from "next/link";
import { notFound } from "next/navigation";
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
