import { z } from "zod";

// z.string().uuid() acepta cualquier versión; el tercer grupo debe empezar por 4.
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const IdSchema = z
  .string()
  .uuid()
  .regex(UUID_V4, { message: "Debe ser un UUID v4" });

// ISO 8601 en UTC (sufijo Z); sin offsets ni objetos Date.
export const FechaIsoSchema = z.string().datetime();
