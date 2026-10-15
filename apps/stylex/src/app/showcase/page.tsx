import { TripCard, type TripCardStyle } from "@/showcase/TripCard";
import { stylex, theme } from "@/theme/index.stylex";

const overrides = stylex.create({
  narrow: { maxInlineSize: 420, marginBlock: theme.sizes.spacing[8] },
  recolor: { color: theme.colors.accent },
});

// @ts-expect-error `color` is outside TripCard's style contract
const _rejected: TripCardStyle = overrides.recolor;

export default function Showcase() {
  return (
    <main sx={styles.main}>
      <TripCard />
      <TripCard sx={overrides.narrow} />
    </main>
  );
}

const styles = stylex.create({
  main: {
    display: "grid",
    maxWidth: 560,
    marginInline: "auto",
    paddingBlock: theme.sizes.spacing[12],
    paddingInline: theme.sizes.spacing[6],
  },
});
