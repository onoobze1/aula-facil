
"use client";

import { useActionState } from "react";
import {
  atualizarAula,
  type EstadoEdicaoAula,
} from "./actions";

type Props = {
  aula: {
    id: string;
    titulo: string;
    descricao: string;
    categoria: string;
    preco: string;
    imagem: string | null;
  };
};

const estadoInicial: EstadoEdicaoAula = {};

export default function FormularioEdicao({ aula }: Props) {
  const [estado, formAction, pendente] = useActionState(
    atualizarAula,
    estadoInicial
  );

  return (
    <form
      action={formAction}
      encType="multipart/form-data"
      className="mt-8 space-y-5"
    >
      <input type="hidden" name="id" value={aula.id} />

      <div>
        <label htmlFor="titulo" className="mb-1 block font-medium">
          Título da aula
        </label>
        <input
          id="titulo"
          name="titulo"
          required
          minLength={3}
          maxLength={100}
          defaultValue={aula.titulo}
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="descricao" className="mb-1 block font-medium">
          Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          required
          minLength={10}
          rows={4}
          defaultValue={aula.descricao}
          className="w-full rounded-lg border px-3 py-2"
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
          defaultValue={aula.categoria}
          className="w-full rounded-lg border px-3 py-2"
        >
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
          defaultValue={aula.preco}
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      {aula.imagem && (
        <div>
          <p className="mb-2 font-medium">Imagem atual</p>
          <img
            src={aula.imagem}
            alt={`Imagem atual de ${aula.titulo}`}
            className="max-h-56 rounded-lg border object-contain"
          />
          <p className="mt-1 text-sm text-gray-500">
            Se não escolher outra imagem, a atual será mantida.
          </p>
        </div>
      )}

      <div>
        <label htmlFor="imagem" className="mb-1 block font-medium">
          Nova imagem (opcional, até 2 MB)
        </label>
        <input
          id="imagem"
          name="imagem"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="w-full min-w-0 rounded-lg border px-3 py-2"
        />
      </div>

      {estado.erro && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {estado.erro}
        </p>
      )}

      <button
        type="submit"
        disabled={pendente}
        className="w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
      >
        {pendente ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  );
}
