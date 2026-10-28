
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AgendamentosPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const agendamentos = await prisma.agendamento.findMany({
    where: {
      alunoId: session.user.id,
    },
    include: {
      aula: {
        include: {
          professor: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: {
      data: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/aulas"
          className="text-sm font-semibold text-blue-700 hover:underline"
        >
          ← Voltar ao catálogo
        </Link>

        <h1 className="mt-6 text-3xl font-bold">
          Meus agendamentos
        </h1>

        <p className="mt-2 text-gray-600">
          Consulte as aulas que você agendou.
        </p>

        {agendamentos.length === 0 ? (
          <div className="mt-8 rounded-xl border bg-white p-8 text-center">
            <h2 className="text-xl font-semibold">
              Você ainda não tem agendamentos
            </h2>

            <p className="mt-2 text-gray-600">
              Explore o catálogo e encontre uma aula.
            </p>

            <Link
              href="/aulas"
              className="mt-4 inline-block font-semibold text-blue-700 hover:underline"
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {agendamentos.map((agendamento) => (
              <article
                key={agendamento.id}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold">
                  {agendamento.aula.titulo}
                </h2>

                <p className="mt-2 text-gray-600">
                  Professor: {agendamento.aula.professor.name}
                </p>

                <p className="mt-2">
                  Data:{" "}
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                    timeZone: "America/Sao_Paulo",
                  }).format(agendamento.data)}
                </p>

                <p className="mt-2">
                  Valor: R${" "}
                  {Number(agendamento.aula.preco)
                    .toFixed(2)
                    .replace(".", ",")}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Status: {agendamento.status}
                </p>

                <Link
                  href={`/aulas/${agendamento.aula.id}`}
                  className="mt-4 inline-block font-semibold text-blue-700 hover:underline"
                >
                  Ver aula
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
