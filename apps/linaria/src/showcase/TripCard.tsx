// Showcase: arbitrary JS evaluated at build time. `stripes()` and `route` are plain TypeScript
// (loops, string building, imported constants). WyW runs them in Node during the build and only
// static CSS ships, so there is no runtime styling cost for computed styles.
import { styled } from "@linaria/react";
import { Card } from "@/components/Card";
import { content } from "@/content";
import { mars, radius, spacing } from "@/theme/tokens";

const stops = Object.values(mars);
const route = stops.map((stop, i) => `${stop} ${(i / (stops.length - 1)) * 100}%`).join(", ");

function stripes(colors: string[], width: number) {
  return colors.map((c, i) => `${c} ${i * width}px ${(i + 1) * width}px`).join(", ");
}

const Banner = styled.div`
  height: 96px;
  margin-bottom: ${spacing[6]};
  border-radius: ${radius.large};
  background:
    repeating-linear-gradient(
      -45deg,
      ${stripes(["rgb(0 0 0 / 0.12)", "transparent"], 12)}
    ),
    linear-gradient(90deg, ${route});
`;

export function TripCard() {
  return (
    <div>
      <Banner aria-hidden />
      <Card title={content.card.title} items={content.card.items} />
    </div>
  );
}
