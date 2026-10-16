import { TripCard } from "@/showcase/TripCard";
import * as styles from "./page.css";

export default function Showcase() {
  return (
    <main className={styles.grid}>
      <TripCard />
      <TripCard featured />
    </main>
  );
}
