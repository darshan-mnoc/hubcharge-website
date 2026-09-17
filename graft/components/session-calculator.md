# components/session-calculator.tsx

- Step · function · L31-L63 — function Step({ n, label, hint, children, }: { n: number; label: string; hint?: string; children: React.ReactNode; })
- Pill · function · L66-L95 — function Pill({ active, onClick, children, label, }: { active: boolean; onClick: () => void; children: React.ReactNode; label?: string; })
- Fact · function · L98-L119 — function Fact({ term, children, strong, }: { term: string; children: React.ReactNode; strong?: boolean; })
- usd · function · L121-L122 — usd = (n: number)
- SessionCalculator · function · L148-L538 — function SessionCalculator({ stations, variant = "section", }: { stations: Station[]; /** "hero" is page-primary and leads with the summary; "section" is a slab. */ variant?: "hero" | "section"; })
