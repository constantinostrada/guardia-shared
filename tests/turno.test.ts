import { describe, expect, expectTypeOf, it } from "vitest";
import type { z } from "zod";
import { TurnoSchema, type Turno } from "../src/index.js";
import { rutasConError, UUID_V4 } from "./helpers.js";

const turno = {
  id: UUID_V4,
  persona: "Ana Pérez",
  desde: "2024-05-01T08:00:00Z",
  hasta: "2024-05-01T20:00:00Z",
};

describe("TurnoSchema — válidos", () => {
  it("acepta un turno con hasta posterior a desde", () => {
    expect(TurnoSchema.safeParse(turno).success).toBe(true);
  });
});

describe("TurnoSchema — inválidos", () => {
  it("rechaza un turno sin persona", () => {
    const { persona: _, ...sinPersona } = turno;
    expect(rutasConError(TurnoSchema.safeParse(sinPersona))).toEqual(["persona"]);
  });

  it("rechaza una persona vacía", () => {
    expect(rutasConError(TurnoSchema.safeParse({ ...turno, persona: "" }))).toEqual(["persona"]);
  });

  it("rechaza un turno con hasta igual a desde", () => {
    const resultado = TurnoSchema.safeParse({ ...turno, hasta: turno.desde });
    expect(rutasConError(resultado)).toEqual(["hasta"]);
  });

  it("rechaza hasta igual a desde aunque difiera la precisión", () => {
    const resultado = TurnoSchema.safeParse({ ...turno, hasta: "2024-05-01T08:00:00.000Z" });
    expect(rutasConError(resultado)).toEqual(["hasta"]);
  });

  it("rechaza un turno con hasta anterior a desde", () => {
    const resultado = TurnoSchema.safeParse({ ...turno, hasta: "2024-05-01T07:59:59Z" });
    expect(rutasConError(resultado)).toEqual(["hasta"]);
  });

  it.each(["123", "3f2b8c1e-9a4d-4e7f-8b21-6c5d0e9f1a2z"])("rechaza el id %s", (id) => {
    expect(rutasConError(TurnoSchema.safeParse({ ...turno, id }))).toEqual(["id"]);
  });

  it.each(["2024-13-01", "ayer", 1714557600000, new Date("2024-05-01T08:00:00Z")])(
    "rechaza desde = %j",
    (desde) => {
      expect(rutasConError(TurnoSchema.safeParse({ ...turno, desde }))).toEqual(["desde"]);
    },
  );

  it.each(["2024-13-01", "ayer", 1714557600000, new Date("2024-05-01T20:00:00Z")])(
    "rechaza hasta = %j",
    (hasta) => {
      expect(rutasConError(TurnoSchema.safeParse({ ...turno, hasta }))).toEqual(["hasta"]);
    },
  );

  it("rechaza campos desconocidos", () => {
    const resultado = TurnoSchema.safeParse({ ...turno, rol: "primario" });
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0]?.code).toBe("unrecognized_keys");
    }
  });
});

describe("Turno (tipo)", () => {
  it("es exactamente z.infer del schema", () => {
    expectTypeOf<Turno>().toEqualTypeOf<z.infer<typeof TurnoSchema>>();
  });
});
