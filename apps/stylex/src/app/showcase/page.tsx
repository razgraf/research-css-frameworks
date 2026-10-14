import * as stylex from "@stylexjs/stylex";
import { TripCard, type TripCardStyle } from "@/showcase/TripCard";
import { colors, spacing } from "@/theme/tokens.stylex";

const overrides = stylex.create({
  narrow: { maxInlineSize: 420, marginBlock: spacing[8] },
  recolor: { color: colors.accent },
});

// @ts-expect-error `color` is outside TripCard's style contract
const _rejected: TripCardStyle = overrides.recolor;

export default function Showcase() {
  return (
    <main {...stylex.props(styles.main)}>
      <TripCard />
      <TripCard style={overrides.narrow} />
    </main>
  );
}

const styles = stylex.create({
  main: {
    display: "grid",
    maxWidth: 560,
    marginInline: "auto",
    paddingBlock: spacing[12],
    paddingInline: spacing[6],
  },
});
