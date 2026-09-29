import { describe, expect, it } from "vitest";
import { SEVERIDADES, SeveridadSchema } from "../src/index.js";

describe("SeveridadSchema", () => {
  it.each(["baja", "media", "alta", "crítica"])("acepta %s", (valor) => {
    expect(SeveridadSchema.safeParse(valor).success).toBe(true);
  });

  it.each(["critica", "CRÍTICA", "Alta", "urgente", "", 3, null, undefined])(
    "rechaza %s",
    (valor) => {
      expect(SeveridadSchema.safeParse(valor).success).toBe(false);
    },
  );

  it("expone la lista de severidades en runtime, en el mismo orden que el schema", () => {
    expect(SEVERIDADES).toEqual(["baja", "media", "alta", "crítica"]);
    expect(SeveridadSchema.options).toEqual([...SEVERIDADES]);
  });
});
