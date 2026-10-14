import { styled } from "@linaria/react";
import { TripCard } from "@/showcase/TripCard";
import { spacing } from "@/theme/tokens";

const Main = styled.main`
  max-width: 560px;
  margin-inline: auto;
  padding: ${spacing[12]} ${spacing[6]};
`;

export default function Showcase() {
  return (
    <Main>
      <TripCard />
    </Main>
  );
}
