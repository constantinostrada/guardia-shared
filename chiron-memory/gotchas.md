# gotcha

A non-obvious pitfall or trap, learned the hard way.

## zod 3 object refinements run even when field string checks failed

What: In zod 3, failed string checks (datetime, uuid, min) are non-fatal, so an object-level `.refine` still runs with invalid values and can add spurious issues (e.g. an ordering error on `hasta` when `desde` is not a date) · Why: only type mismatches abort before refinements · Where: src/turno.ts · Learned: guard cross-field refinements by re-validating the fields they compare
