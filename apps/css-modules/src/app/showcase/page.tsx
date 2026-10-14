import { TripCard } from "@/showcase/TripCard";
import styles from "./page.module.css";

export default function Showcase() {
  return (
    <main className={styles.grid}>
      <TripCard />
      <TripCard featured />
    </main>
  );
}
