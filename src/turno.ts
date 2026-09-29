import { z } from "zod";
import { FechaIsoSchema, IdSchema } from "./primitivos.js";

export const TurnoSchema = z
  .object({
    id: IdSchema,
    persona: z.string().trim().min(1, { message: "La persona no puede estar vacía" }),
    desde: FechaIsoSchema,
    hasta: FechaIsoSchema,
  })
  .strict()
  .refine(
    (turno) =>
      // Los checks de string de zod 3 no abortan el parse: si alguna fecha ya es
      // inválida su propio issue basta, sin añadir uno de orden en "hasta".
      !esFechaIso(turno.desde) ||
      !esFechaIso(turno.hasta) ||
      Date.parse(turno.hasta) > Date.parse(turno.desde),
    {
      path: ["hasta"],
      message: "hasta debe ser estrictamente posterior a desde",
    },
  );

function esFechaIso(valor: string): boolean {
  return FechaIsoSchema.safeParse(valor).success;
}

export type Turno = z.infer<typeof TurnoSchema>;
