import { MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  items: { title: string; text: string }[];
  footer?: ReactNode;
  className?: string;
};

export function Card({ title, items, footer, className }: Props) {
  return (
    <article
      className={cn(
        "surface @container p-6 transition-colors hover:border-accent md:p-8",
        className,
      )}
    >
      <h2 className="mb-6 font-bold text-large">{title}</h2>
      <ul className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <li key={item.title} className="grid grid-cols-[auto_1fr] gap-3">
            <MapPin className="size-icon-medium text-accent" aria-hidden />
            <div>
              <span className="font-medium">{item.title}</span>
              <p className="mt-1 text-small text-text-secondary leading-[1.5]">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
      {footer && (
        <div className="mt-8 flex flex-col-reverse gap-3 @card-wide:flex-row @card-wide:justify-end">
          {footer}
        </div>
      )}
    </article>
  );
}
