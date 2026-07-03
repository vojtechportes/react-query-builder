# Field-To-Field Phase 1 Tasks

1. Completed: establish the canonical rule model for literal vs field-reference comparisons, including defaults, equality semantics, nearest-field snapshots, and field-change payload plumbing.
2. Completed: add visual builder support for field-to-field comparisons, including a value-source selector, compatible target-field selection, and validation/rendering updates for field-reference rules.
3. Completed for the Phase 1 SQL-backed slice: translate directly expressible field-to-field comparisons through the SQL parser, SQL formatter, and SQL text mode flows shared by both the built-in text editor and Monaco-backed text mode.
4. Completed: clean up the broader `src/builder/builder.test.tsx` TypeScript fallout from the normalized-rule union change introduced in Task 1 so the full builder suite compiles cleanly again.
5. Completed: extend field-to-field translation beyond the current SQL-backed slice, including non-SQL parsers/formatters and any operator-specific cases that are natively representable without inventing backend-only syntax.
   - Completed slice: OData scalar field-to-field support for `eq`, `ne`, `gt`, `ge`, `lt`, and `le`, including formatter output, parser round-tripping, and inferred target fields.
   - Completed slice: AQL scalar field-to-field support for `==`, `!=`, `>`, `>=`, `<`, and `<=`, including formatter output, parser round-tripping, inferred target fields, and collapse guards for range folding.
   - Completed slice: CEL scalar field-to-field support for `==`, `!=`, `>`, `>=`, `<`, and `<=`, including formatter output, parser round-tripping, inferred target fields, and collapse guards for range folding.
   - Completed slice: Dynamo scalar field-to-field support for `=`, `<>`, `>`, `>=`, `<`, and `<=`, including formatter output, parser round-tripping, inferred target fields, and collapse guards for not-between folding.
   - Completed slice: Prisma scalar field-to-field support for `equals`, `not`, `gt`, `gte`, `lt`, and `lte`, using a JSON `$ref` field-reference sentinel, with formatter output, parser round-tripping, inferred target fields, and collapse guards for range folding.
   - Completed slice: JsonLogic scalar field-to-field support for `==`, `!=`, `>`, `>=`, `<`, and `<=`, using native `var` references on the right-hand side, with formatter output, parser round-tripping, inferred target fields, and range-collapse guards.
   - Completed slice: SpEL scalar field-to-field support for `==`, `!=`, `>`, `>=`, `<`, and `<=`, using native RHS field identifiers, with formatter output, parser round-tripping, inferred target fields, and range-collapse guards.
   - Completed slice: JSONata scalar field-to-field support for `=`, `!=`, `>`, `>=`, `<`, and `<=`, using native RHS field identifiers, with formatter output, parser round-tripping, inferred target fields, range-collapse guards, and explicit rejection of computed RHS expressions outside the builder model.
   - Completed slice: Mongo scalar field-to-field support for `=`, `!=`, `>`, `>=`, `<`, and `<=`, using native `$expr` comparisons with field references on both sides, with formatter output, parser round-tripping, inferred target fields, and explicit rejection of `$expr` shapes outside the builder field-to-field model.
   - Completed slice: Django scalar field-to-field support for `=`, `!=`, `>`, `>=`, `<`, and `<=`, using native RHS `F()` references, with formatter output, parser round-tripping, inferred target fields, and range-collapse guards.
   - Completed slice: native field-to-field string-method support for CEL, OData, and Django where the RHS can be passed directly as a field reference without synthesizing computed expressions.
   - Completed hardening: broader Mongo `$expr` negative-path coverage for invalid shapes such as unsupported operators, wrong operand counts, and multi-operator payloads.
   - Phase 1 policy: do not invent custom backend-only field-to-field syntax for formats that do not natively support it. For those formats, skip field-to-field formatter support and fail parsing/validation clearly when field-to-field comparisons are encountered or requested. RSQL is explicitly in this category unless native support is identified.

## Phase 2 Checklist

- [x] Slice 1: add Builder-level `allowFieldComparisons?: boolean` with default `false`, thread it through Builder/context/validation/text-mode plumbing, and preserve recovery for preloaded `valueSource: 'field'` rules.
- [x] Slice 2: extend field configuration with semantic field-comparison metadata via `fieldComparison?: { type?: 'string' | 'number' | 'date' | 'boolean'; comparableFields?: string[] }`.
- [x] Slice 3: refactor field-comparison compatibility helpers to use semantic comparison types and source-owned allowlists instead of raw builder `type` equality.
- [x] Slice 4: update Builder UI and widget mutation flows (`rule`, `field-select`, `operator-select`, `value-source-select`, `value-field-select`) to honor the new Builder flag and semantic compatibility rules.
- [x] Slice 5: update Builder validation, Builder SQL text-mode semantic validation, Monaco diagnostics, and non-Monaco diagnostics to use the shared semantic field-comparison rules and distinct failure codes.
- [x] Slice 6: expand demo/example coverage with opt-in Builder field comparisons, semantically compatible `LIST <-> TEXT` examples, additional numeric targets, and allowlist-restricted examples.
- [x] Slice 7: broaden automated coverage for helper logic, widget transition behavior, Builder validation, text-mode diagnostics, and demo/build smoke coverage.
- [x] Evaluate whether SpEL field-to-field string-method comparisons can be made to round-trip cleanly through the current parser layer without inventing non-native syntax.
- [x] If SpEL string-method field references become round-trippable, add formatter support, parser support, inferred-field coverage, and builder/text-mode validation coverage for `contains`, `startsWith`, and `endsWith`.
- [x] Add extra negative-path parser coverage for the new native string field-reference entry points in CEL, OData, and Django so unsupported shapes fail explicitly and stay guarded over time.
- [x] Harden unsupported field-to-field handling for RSQL and Elasticsearch: formatter-side explicit throws for valueSource: 'field' rules, Elasticsearch parser rejection for unsupported object/non-scalar RHS shapes, and documented RSQL parser ambiguity where native syntax cannot distinguish bare string literals from hypothetical field references.
- [ ] Re-evaluate any remaining format/operator combinations only if a direct native RHS field-reference shape is identified that fits the builder model without computed-expression synthesis.

## Won't Implement Checklist

- [x] Elasticsearch field-to-field support: requires script-query or runtime-field semantics rather than the native term/range/prefix/wildcard DSL shapes supported in this feature.
- [x] RSQL field-to-field support via custom backend-only functions or invented syntax.
- [x] AQL field-to-field string comparisons that would require wildcard or pattern synthesis instead of a direct native field reference on the RHS.
- [x] Mongo field-to-field regex or pattern matching that would require computed regex-expression semantics beyond the builder model.
- [x] Prisma field-to-field string filters that would require non-native or synthesized semantics beyond the current direct-reference model.
- [x] Any other format/operator combination that cannot be represented as a native direct field-to-field comparison without backend-specific extensions or computed-expression synthesis.












