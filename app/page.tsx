
import Link from "next/link";
import { getSession } from "@/lib/auth-server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getSession();

  async function sair() {
    "use server";

    await auth.api.signOut({
      headers: await headers(),
    });
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <header className="flex items-center justify-between border-b bg-white px-6 py-5">
        <Link href="/" className="text-2xl font-bold text-blue-700">
          AulaFácil
        </Link>

        <nav className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm">
                Olá, {session.user.name}
              </span>
              <form action={sair}>
                <button
                  type="submit"
                  className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Sair
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm hover:text-blue-700">
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="rounded-lg bg-blue-700 px-4 py-2 text-sm text-white hover:bg-blue-800"
              >
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <p className="mb-3 font-semibold text-blue-700">
          Aprenda no seu ritmo
        </p>
        <h1 className="text-4xl font-bold md:text-6xl">
          Encontre a aula ideal para você
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Descubra professores de idiomas, música e reforço escolar.
          Escolha sua aula e agende seu próximo aprendizado.
        </p>
        <Link
          href="/aulas"
          className="mt-8 inline-block rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
        >
          Explorar aulas
        </Link>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-20 md:grid-cols-3">
        {[
          {
            titulo: "Idiomas",
            descricao: "Aprenda inglês, espanhol e outros idiomas.",
          },
          {
            titulo: "Música",
            descricao: "Desenvolva suas habilidades musicais.",
          },
          {
            titulo: "Reforço escolar",
            descricao: "Encontre apoio para seus estudos.",
          },
        ].map((item) => (
          <article
            key={item.titulo}
            className="rounded-xl border bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold">{item.titulo}</h2>
            <p className="mt-2 text-gray-600">{item.descricao}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
