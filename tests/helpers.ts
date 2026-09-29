import type { z } from "zod";

// Devuelve las rutas distintas (a.b.c) de los issues de un parse fallido.
export function rutasConError(resultado: z.SafeParseReturnType<unknown, unknown>): string[] {
  if (resultado.success) return [];
  return [...new Set(resultado.error.issues.map((issue) => issue.path.join(".")))];
}

export const UUID_V4 = "3f2b8c1e-9a4d-4e7f-8b21-6c5d0e9f1a23";
