import { styled } from "next-yak";
import { TripCard } from "@/showcase/TripCard";
import { media } from "@/theme/breakpoints";
import { spacing } from "@/theme/tokens";

const Grid = styled.main`
  display: grid;
  gap: ${spacing.s12};
  max-width: 1152px;
  margin-inline: auto;
  padding: ${spacing.s12} ${spacing.s6};

  ${media.lg} {
    grid-template-columns: 1fr 1fr;
  }
`;

export default function Showcase() {
  return (
    <Grid>
      <TripCard progress={25} />
      <TripCard progress={80} />
    </Grid>
  );
}
