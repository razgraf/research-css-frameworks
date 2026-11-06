// Showcase: typed values and responsive variants. The caller picks `layout` per breakpoint through
// `conditions`, which compiles to a media query instead of JS, and `progress` only accepts a
// `${number}%` string bound through a custom property. Raw values on token properties fail `tsc`.
import type { Props } from "zyzz";
import { Card } from "@/components/Card";
import { content } from "@/content";
import { style, variants, vars } from "@/theme";

type TripCardProps = Props.Variants<typeof styles.countdown> & { progress: number };

export function TripCard({ progress, ...selection }: TripCardProps) {
  return (
    <Card
      title={content.card.title}
      items={content.card.items}
      footer={
        <div {...styles.countdown(selection)}>
          Launch prep {progress}% complete
          <div {...styles.track()}>
            <div {...styles.fill({ progress: `${progress}%` })} />
          </div>
        </div>
      }
    />
  );
}

namespace styles {
  export const countdown = variants({
    base: { color: "textSecondary", display: "flex", flexGrow: 1, fontSize: "small", gap: "2" },
    conditions: { wide: "@media >=md" },
    defaultVariants: { layout: "stacked" },
    variants: {
      layout: {
        inline: { alignItems: "center", flexDirection: "row" },
        stacked: { flexDirection: "column" },
      },
    },
  });

  export const track = style({
    backgroundColor: "surfaceHover",
    borderRadius: "full",
    flexGrow: 1,
    height: "8px !custom",
    overflow: "hidden",
  });

  export const fill = style((values: { progress: `${number}%` }) => ({
    backgroundColor: "accent",
    height: "100% !custom",
    transition: `width ${vars.duration.fast} ${vars.ease.standard}`,
    width: `${values.progress} !custom`,
  }));
}

// @ts-expect-error a progress needs its unit
const _unitless = () => styles.fill({ progress: "50" });
