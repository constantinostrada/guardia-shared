import { z } from "zod";

export const SEVERIDADES = ["baja", "media", "alta", "crítica"] as const;

export const SeveridadSchema = z.enum(SEVERIDADES);

export type Severidad = z.infer<typeof SeveridadSchema>;
