# lib/guides.ts

- GuideGroup · type · L8-L8 — type GuideGroup = "start" | "how" | "vehicles" | "practical" | "trips" | "reference";
- Guide · type · L10-L27 — type Guide = { slug: string; // path after /charging-101/ title: string; /** Shorter label for nav and prev/next chrome */ navTitle?: string; desc: string; read: string; group: GuideGroup; /** * The answer, before the explanation — two or three sentences a reader with * no EV vocabulary can act on. Enforced jargon-free: none of the 14 terms in * lib/glossary.ts may appear here. If a summary needs the jargon to make * sense, it is not a summary, it is the article. */ short: string; /** Plain-English nudge shown on the index for the entry point */ note?: string; };
- guideHref · function · L212-L212 — guideHref = (slug: string)
- getGuide · function · L214-L216 — function getGuide(slug: string): Guide | undefined
- guideNeighbours · function · L226-L232 — function guideNeighbours(slug: string): { prev?: Guide; next?: Guide }
- guidesByGroup · function · L234-L236 — function guidesByGroup(group: GuideGroup): Guide[]
- guideSectionId · function · L252-L258 — function guideSectionId(heading: string): string
