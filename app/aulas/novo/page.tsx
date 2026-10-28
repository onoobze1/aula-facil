
import Link from "next/link";
import { cadastrarAula } from "./actions";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NovaAulaPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 text-gray-900">
      <section className="w-full max-w-2xl rounded-xl border bg-white p-8 shadow-sm">
        <Link href="/aulas" className="text-sm text-blue-700 hover:underline">
          ← Voltar ao catálogo
        </Link>

        <h1 className="mt-5 text-3xl font-bold">Cadastrar nova aula</h1>
        <p className="mt-2 text-gray-600">
          Preencha os dados para anunciar sua aula.
        </p>

        <form action={cadastrarAula} className="mt-8 space-y-5">
          <div>
            <label htmlFor="titulo" className="mb-1 block font-medium">
              Título da aula
            </label>
            <input
              id="titulo"
              name="titulo"
              type="text"
              minLength={3}
              required
              maxLength={100}
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Ex.: Inglês para iniciantes"
            />
          </div>

          <div>
            <label htmlFor="descricao" className="mb-1 block font-medium">
              Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              minLength={10}
              required
              rows={4}
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Explique o conteúdo e como serão as aulas."
            />
          </div>

          <div>
            <label htmlFor="categoria" className="mb-1 block font-medium">
              Categoria
            </label>
            <select
              id="categoria"
              name="categoria"
              required
              className="w-full rounded-lg border px-3 py-2"
              defaultValue=""
            >
              <option value="" disabled>
                Selecione uma categoria
              </option>
              <option value="Idiomas">Idiomas</option>
              <option value="Música">Música</option>
              <option value="Reforço escolar">Reforço escolar</option>
            </select>
          </div>

          <div>
            <label htmlFor="preco" className="mb-1 block font-medium">
              Preço por aula (R$)
            </label>
            <input
              id="preco"
              name="preco"
              type="number"
              min="0.01"
              step="0.01"
              required
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Ex.: 50.00"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Cadastrar aula
          </button>
        </form>
      </section>
    </main>
  );
}
