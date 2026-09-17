# lib/glossary.ts

- GlossaryTerm · type · L18-L25 — type GlossaryTerm = { /** URL-safe anchor — /charging-101/glossary#kw */ id: string; term: string; def: string; /** Popover-length version, when `def` runs long. */ short?: string; };
- GlossaryGroup · type · L27-L27 — type GlossaryGroup = { id: string; label: string; terms: string[] };
- GlossaryId · type · L136-L136 — type GlossaryId = (typeof GLOSSARY_TERMS)[number]["id"];
- glossaryTerm · function · L140-L142 — function glossaryTerm(id: string): GlossaryTerm | undefined
- glossaryBrief · function · L145-L147 — function glossaryBrief(t: GlossaryTerm): string
