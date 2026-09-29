import { describe, expect, expectTypeOf, it } from "vitest";
import type { z } from "zod";
import { IncidenteSchema, type Incidente } from "../src/index.js";
import { rutasConError, UUID_V4 } from "./helpers.js";

const abierto = {
  id: UUID_V4,
  titulo: "Caída del servicio de pagos",
  severidad: "alta",
  estado: "abierto",
  creadoEn: "2024-05-01T10:00:00Z",
};

const cerrado = { ...abierto, estado: "cerrado", cerradoEn: "2024-05-01T12:30:00.000Z" };

describe("IncidenteSchema — válidos", () => {
  it("acepta un incidente abierto sin fecha de cierre", () => {
    expect(IncidenteSchema.safeParse(abierto).success).toBe(true);
  });

  it("acepta un incidente cerrado con fecha de cierre", () => {
    expect(IncidenteSchema.safeParse(cerrado).success).toBe(true);
  });
});

describe("IncidenteSchema — inválidos", () => {
  it("rechaza un incidente cerrado sin fecha de cierre", () => {
    const { cerradoEn: _, ...sinCierre } = cerrado;
    expect(rutasConError(IncidenteSchema.safeParse(sinCierre))).toEqual(["cerradoEn"]);
  });

  it("rechaza un incidente abierto con fecha de cierre", () => {
    const resultado = IncidenteSchema.safeParse({ ...abierto, cerradoEn: "2024-05-01T12:00:00Z" });
    expect(rutasConError(resultado)).toEqual(["cerradoEn"]);
  });

  it("rechaza un incidente sin título", () => {
    const { titulo: _, ...sinTitulo } = abierto;
    expect(rutasConError(IncidenteSchema.safeParse(sinTitulo))).toEqual(["titulo"]);
  });

  it.each(["", "   "])("rechaza un título vacío (%j)", (titulo) => {
    expect(rutasConError(IncidenteSchema.safeParse({ ...abierto, titulo }))).toEqual(["titulo"]);
  });

  it("rechaza un título con tipo incorrecto", () => {
    expect(rutasConError(IncidenteSchema.safeParse({ ...abierto, titulo: 42 }))).toEqual(["titulo"]);
  });

  it("rechaza una severidad fuera del conjunto", () => {
    const resultado = IncidenteSchema.safeParse({ ...abierto, severidad: "urgente" });
    expect(rutasConError(resultado)).toEqual(["severidad"]);
  });

  it("rechaza un estado desconocido", () => {
    const resultado = IncidenteSchema.safeParse({ ...abierto, estado: "resuelto" });
    expect(rutasConError(resultado)).toEqual(["estado"]);
  });

  it.each([
    "123",
    "3f2b8c1e-9a4d-4e7f-8b21-6c5d0e9f1a2", // un carácter menos
    "3f2b8c1e-9a4d-1e7f-8b21-6c5d0e9f1a23", // versión 1, no v4
    "not-a-uuid",
  ])("rechaza el id %s", (id) => {
    expect(rutasConError(IncidenteSchema.safeParse({ ...abierto, id }))).toEqual(["id"]);
  });

  it.each([
    "2024-13-01",
    "ayer",
    "2024-05-01",
    "2024-05-01T10:00:00+02:00",
    1714557600000,
    new Date("2024-05-01T10:00:00Z"),
  ])("rechaza creadoEn = %j", (creadoEn) => {
    expect(rutasConError(IncidenteSchema.safeParse({ ...abierto, creadoEn }))).toEqual(["creadoEn"]);
  });

  it.each(["ayer", 1714557600000, new Date("2024-05-01T12:00:00Z")])(
    "rechaza cerradoEn = %j",
    (cerradoEn) => {
      expect(rutasConError(IncidenteSchema.safeParse({ ...cerrado, cerradoEn }))).toEqual([
        "cerradoEn",
      ]);
    },
  );

  it("rechaza campos desconocidos", () => {
    const resultado = IncidenteSchema.safeParse({ ...abierto, prioridad: 1 });
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0]?.code).toBe("unrecognized_keys");
    }
  });
});

describe("Incidente (tipo)", () => {
  it("es exactamente z.infer del schema", () => {
    expectTypeOf<Incidente>().toEqualTypeOf<z.infer<typeof IncidenteSchema>>();
    expectTypeOf<Incidente["cerradoEn"]>().toEqualTypeOf<string | undefined>();
  });
});
