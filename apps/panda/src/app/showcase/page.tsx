import { css } from "styled-system/css";
import { TripCard } from "@/showcase/TripCard";

export default function Showcase() {
  return (
    <main className={styles.main}>
      <TripCard />
      <TripCard tone="featured" />
    </main>
  );
}

const styles = {
  main: css({
    display: "grid",
    gap: "12",
    maxWidth: "[560px]",
    mx: "auto",
    py: "12",
    px: "6",
  }),
};
