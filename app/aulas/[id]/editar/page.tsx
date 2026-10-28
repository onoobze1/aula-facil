
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import FormularioEdicao from "./formulario-edicao";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditarAulaPage({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const aula = await prisma.aula.findFirst({
    where: {
      id,
      professorId: session.user.id,
    },
  });

  if (!aula) {
    notFound();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 text-gray-900">
      <section className="w-full max-w-2xl rounded-xl border bg-white p-5 shadow-sm sm:p-8">
        <Link
          href={`/aulas/${aula.id}`}
          className="text-sm text-blue-700 hover:underline"
        >
          ← Voltar à aula
        </Link>

        <h1 className="mt-5 text-3xl font-bold">Editar aula</h1>

        <p className="mt-2 text-gray-600">
          Altere os dados abaixo e salve suas modificações.
        </p>

        <FormularioEdicao
          aula={{
            id: aula.id,
            titulo: aula.titulo,
            descricao: aula.descricao,
            categoria: aula.categoria,
            preco: String(aula.preco),
            imagem: aula.imagem,
          }}
        />
      </section>
    </main>
  );
}
