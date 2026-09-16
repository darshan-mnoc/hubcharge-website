/**
 * The HubCharge illustration kit, dropped into the site.
 *
 * The scenes in public/illustrations are complete animated SVGs: the charger,
 * the car and the attendant, the lighting, the motion and the timing all live
 * inside each file, and they loop on their own with no JavaScript.
 *
 * They are INLINED rather than referenced with <img> for two reasons that both
 * matter here:
 *
 *   - an <img> is its own document, so it cannot see the page's webfonts. The
 *     step numbers are Fraunces and the labels are Plus Jakarta Sans; through
 *     an <img> both fall back to whatever the visitor's system has.
 *   - inlined, the file is read on the server at build time and serialised
 *     into the payload, so none of it reaches the client bundle.
 *
 * Every file namespaces its own ids, classes and keyframes, so any number of
 * them can sit on one page without colliding. Each carries its own <title>,
 * and each stops animating under prefers-reduced-motion.
 */
import { CoverFrame } from "@/components/cover-frame";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export type KitScene =
  | "hubcharge-how-it-works"
  | "hubcharge-how-it-works-no-labels"
  | "hubcharge-charging-hero"
  | "hubcharge-no-adapter"
  | "hubcharge-charger-anatomy"
  | "hubcharge-makes"
  | "hubcharge-step-1-arrive"
  | "hubcharge-step-2-easy-payment"
  | "hubcharge-step-3-charge"
  | "hubcharge-step-4-add-time-or-services"
  | "hubcharge-step-5-finish";

/* Read once per scene per server process, not once per render — but never in
   development, where the whole point is to drop a re-exported scene into
   public/illustrations and hit refresh. */
const cache = new Map<KitScene, string>();
const CACHE = process.env.NODE_ENV === "production";

function scene(name: KitScene, fill: boolean): string {
  const key = `${name}${fill ? ":fill" : ""}` as KitScene;
  const hit = CACHE ? cache.get(key) : undefined;
  if (hit) return hit;
  const raw = readFileSync(join(process.cwd(), "public", "illustrations", `${name}.svg`), "utf8");
  /* The files ship without width/height so they scale to their container;
     an inline <svg> without them would otherwise take the replaced-element
     default of 300x150 in some engines. `fill` is for a box that already has
     the scene's aspect — a 3:2 guide cover — where height has to follow the
     box rather than the width. */
  const style = fill
    ? "display:block;width:100%;height:100%"
    : "display:block;width:100%;height:auto";
  const sized = raw.replace("<svg ", `<svg style="${style}" `);
  cache.set(key, sized);
  return sized;
}

export function KitIllustration({
  name,
  className = "",
  fill = false,
}: {
  name: KitScene;
  className?: string;
  /** Stretch to the container's height as well as its width. */
  fill?: boolean;
}) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: scene(name, fill) }} />;
}

/**
 * A kit scene used as a guide masthead, in the same frame the drawn covers
 * use — so it gets the pointer parallax and the atmosphere planes with them.
 */
export function KitCover({ name }: { name: KitScene }) {
  return (
    <CoverFrame>
      <KitIllustration name={name} className="hc-kit" fill />
    </CoverFrame>
  );
}
