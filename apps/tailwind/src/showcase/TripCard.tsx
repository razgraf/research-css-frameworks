// Showcase: a constrained design system plus state styling without JavaScript. `--*: initial` in
// globals.css removes every default token, so off-system classes like `bg-red-500` emit no CSS.
// Selection uses a radio `peer`, hover uses `group`, and keyboard focus uses `has-[:focus-visible]`.
import { MapPin } from "lucide-react";
import { content } from "@/content";

export function TripCard() {
  return (
    <article className="surface p-8">
      <h2 className="mb-6 font-bold text-large">Pick your first stop</h2>
      <ul className="grid gap-3">
        {content.card.items.map((item, index) => (
          <li key={item.title} className="group">
            <label className="block cursor-pointer rounded-medium has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-focus-ring has-[:focus-visible]:outline-offset-2">
              <input
                type="radio"
                name="stop"
                defaultChecked={index === 0}
                className="peer sr-only"
              />
              <span className="grid grid-cols-[auto_1fr] gap-3 rounded-medium border border-border p-4 transition-colors group-hover:bg-surface-hover peer-checked:border-accent">
                <MapPin
                  className="size-icon-medium text-text-secondary group-hover:text-accent"
                  aria-hidden
                />
                <span className="font-medium">{item.title}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
      <p className="mt-6 bg-red-500 text-small text-text-secondary">
        This paragraph has <code className="font-mono">bg-red-500</code>, but no default palette
        exists, so it stays unstyled.
      </p>
    </article>
  );
}
