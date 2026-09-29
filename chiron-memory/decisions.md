# decision

A choice made and the reasoning behind it — the path taken over the alternatives.

## Domain types are inferred from zod schemas only

What: Incidente, Turno and Severidad types are `z.infer` aliases of their schemas; no hand-written interfaces, and the severity list lives once in `SEVERIDADES` (feeds `z.enum`) · Why: a single definition validates at runtime and types at compile time, so API and clients cannot silently diverge · Where: src/severidad.ts, src/incidente.ts, src/turno.ts, src/index.ts

## Domain dates are UTC ISO strings, ids are UUID v4, unknown keys rejected

What: Dates use `z.string().datetime()` (UTC `Z` only, no Date objects cross the package boundary); ids use `z.string().uuid()` plus a v4 regex; entity schemas are `.strict()` · Why: one wire format for every consumer; `.uuid()` alone accepts any UUID version; strict objects surface typos/extra fields instead of dropping them silently · Where: src/primitivos.ts
