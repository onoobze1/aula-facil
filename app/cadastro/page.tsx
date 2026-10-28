
"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function cadastrar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");

    if (senha.length < 8) {
      setErro("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setCarregando(true);

    try {
      const resultado = await authClient.signUp.email({
        name: nome.trim(),
        email: email.trim(),
        password: senha,
      });

      if (resultado.error) {
        setErro(
          resultado.error.message ?? "Não foi possível criar sua conta."
        );
        return;
      }

      window.location.href = "/";
    } catch {
      setErro("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <section className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
        <Link href="/" className="text-2xl font-bold text-blue-700">
          AulaFácil
        </Link>

        <h1 className="mt-6 text-2xl font-bold">Criar conta</h1>
        <p className="mt-2 text-gray-600">
          Cadastre-se para começar a usar o AulaFácil.
        </p>

        <form onSubmit={cadastrar} className="mt-6 space-y-4">
          <div>
            <label htmlFor="nome" className="mb-1 block text-sm font-medium">
              Nome
            </label>
            <input
              id="nome"
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
              placeholder="voce@exemplo.com"
            />
          </div>

          <div>
            <label htmlFor="senha" className="mb-1 block text-sm font-medium">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              required
              minLength={8}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Mínimo de 8 caracteres"
            />
          </div>

          {erro && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
          >
            {carregando ? "Criando conta..." : "Cadastrar"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          Já tem uma conta?{" "}
          <Link href="/login" className="font-semibold text-blue-700">
            Entrar
          </Link>
        </p>
      </section>
    </main>
  );
}
