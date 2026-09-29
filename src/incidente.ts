import { z } from "zod";
import { FechaIsoSchema, IdSchema } from "./primitivos.js";
import { SeveridadSchema } from "./severidad.js";

export const EstadoIncidenteSchema = z.enum(["abierto", "cerrado"]);

export const IncidenteSchema = z
  .object({
    id: IdSchema,
    titulo: z.string().trim().min(1, { message: "El título no puede estar vacío" }),
    severidad: SeveridadSchema,
    estado: EstadoIncidenteSchema,
    creadoEn: FechaIsoSchema,
    cerradoEn: FechaIsoSchema.optional(),
  })
  .strict()
  .superRefine((incidente, ctx) => {
    if (incidente.estado === "cerrado" && incidente.cerradoEn === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cerradoEn"],
        message: "Un incidente cerrado requiere fecha de cierre",
      });
    }
    if (incidente.estado === "abierto" && incidente.cerradoEn !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cerradoEn"],
        message: "Un incidente abierto no puede tener fecha de cierre",
      });
    }
  });

export type EstadoIncidente = z.infer<typeof EstadoIncidenteSchema>;
export type Incidente = z.infer<typeof IncidenteSchema>;
