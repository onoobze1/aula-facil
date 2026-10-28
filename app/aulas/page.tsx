
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { excluirAula } from "./actions";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ busca?: string }>;
};

export default async function AulasPage({ searchParams }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { busca } = await searchParams;
  const termo = busca?.trim() ?? "";

  const aulas = await prisma.aula.findMany({
    where: termo
      ? {
          OR: [
            {
              titulo: {
                contains: termo,
                mode: "insensitive",
              },
            },
            {
              categoria: {
                contains: termo,
                mode: "insensitive",
              },
            },
            {
              descricao: {
                contains: termo,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined,
    include: {
      professor: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <header className="flex items-center justify-between border-b bg-white px-6 py-5">
        <Link href="/" className="text-2xl font-bold text-blue-700">
          AulaFácil
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm hover:text-blue-700">
            Voltar ao início
          </Link>

          {session ? (
            <span className="hidden text-sm text-gray-600 sm:inline">
              Olá, {session.user.name}
            </span>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-blue-700 hover:underline"
            >
              Entrar
            </Link>
          )}
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Catálogo de aulas</h1>
            <p className="mt-2 text-gray-600">
              Encontre aulas de idiomas, música e reforço escolar.
            </p>
          </div>

          {session && (
            <Link
              href="/aulas/novo"
              className="rounded-lg bg-blue-700 px-5 py-3 text-center font-semibold text-white hover:bg-blue-800"
            >
              + Cadastrar aula
            </Link>
          )}
        </div>

        <form
          action="/aulas"
          method="GET"
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="search"
            name="busca"
            defaultValue={termo}
            placeholder="Buscar por título, categoria ou descrição..."
            aria-label="Buscar aulas"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
          />

          <button
            type="submit"
            className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Buscar
          </button>

          {termo && (
            <Link
              href="/aulas"
              className="rounded-lg border border-gray-300 px-6 py-3 text-center font-semibold hover:bg-gray-100"
            >
              Limpar
            </Link>
          )}
        </form>

        {aulas.length === 0 ? (
          <div className="mt-8 rounded-xl border bg-white p-8 text-center">
            <h2 className="text-xl font-semibold">
              {termo
                ? "Nenhuma aula encontrada"
                : "Ainda não há aulas cadastradas"}
            </h2>

            <p className="mt-2 text-gray-600">
              {termo
                ? `Não encontramos aulas para "${termo}". Tente outra busca.`
                : "Em breve, você encontrará novas opções por aqui."}
            </p>

            {!session && !termo && (
              <Link
                href="/cadastro"
                className="mt-4 inline-block font-semibold text-blue-700 hover:underline"
              >
                Cadastre-se para anunciar uma aula
              </Link>
            )}
          </div>
        ) : (
          <>
            {termo && (
              <p className="mt-6 text-sm text-gray-600">
                {aulas.length} resultado(s) encontrado(s) para "{termo}".
              </p>
            )}

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {aulas.map((aula) => {
                const minhaAula = session?.user.id === aula.professorId;

                return (
                  <article
                    key={aula.id}
                    className="rounded-xl border bg-white p-6 shadow-sm"
                  >
                    <p className="text-sm font-semibold text-blue-700">
                      {aula.categoria}
                    </p>

                    <h2 className="mt-2 text-xl font-bold">
                      {aula.titulo}
                    </h2>

                    <p className="mt-2 whitespace-pre-wrap text-gray-600">
                      {aula.descricao}
                    </p>

                    <p className="mt-4 text-sm text-gray-500">
                      Professor: {aula.professor.name}
                    </p>

                    <p className="mt-3 text-lg font-bold">
                      R$ {Number(aula.preco).toFixed(2).replace(".", ",")}
                    </p>

                    <Link
                      href={`/aulas/${aula.id}`}
                      className="mt-4 inline-block font-semibold text-blue-700 hover:underline"
                    >
                      Ver detalhes
                    </Link>

                    {minhaAula && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                          href={`/aulas/${aula.id}/editar`}
                          className="rounded-lg border border-blue-700 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                        >
                          Editar aula
                        </Link>

                        <form action={excluirAula}>
                          <input
                            type="hidden"
                            name="id"
                            value={aula.id}
                          />

                          <button
                            type="submit"
                            className="rounded-lg border border-red-600 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                          >
                            Excluir aula
                          </button>
                        </form>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
