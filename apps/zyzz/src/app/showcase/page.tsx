import { TripCard } from "@/showcase/TripCard";
import { style } from "@/theme";

export default function Showcase() {
  return (
    <main {...styles.grid()}>
      <TripCard progress={25} />
      <TripCard progress={70} conditions={{ wide: { layout: "inline" } }} />
    </main>
  );
}

namespace styles {
  export const grid = style({
    display: "grid",
    gap: "12",
    marginInline: "auto !custom",
    maxWidth: "1152px !custom",
    paddingBlock: "12",
    paddingInline: "6",
    "@media >=lg": { gridTemplateColumns: "1fr 1fr" },
  });
}
