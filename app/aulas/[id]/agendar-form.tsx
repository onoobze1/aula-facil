
"use client";

import { useActionState } from "react";
import {
  agendarAula,
  type EstadoAgendamento,
} from "./actions";

const estadoInicial: EstadoAgendamento = {};

export default function AgendarForm({
  aulaId,
}: {
  aulaId: string;
}) {
  const [estado, formAction, pendente] = useActionState(
    agendarAula,
    estadoInicial,
  );

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <input type="hidden" name="aulaId" value={aulaId} />

      <div>
        <label
          htmlFor="data"
          className="mb-2 block text-sm font-semibold"
        >
          Data e horário da aula
        </label>

        <input
          id="data"
          name="data"
          type="datetime-local"
          required
          step={60}
          defaultValue={estado.data}
          className="w-full rounded-lg border border-gray-300 px-4 py-3"
        />
      </div>

      {estado.erro && (
        <p role="alert" className="text-sm text-red-600">
          {estado.erro}
        </p>
      )}

      <button
        type="submit"
        disabled={pendente}
        className="w-full rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
      >
        {pendente ? "Agendando..." : "Agendar aula"}
      </button>
    </form>
  );
}
