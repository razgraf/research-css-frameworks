// Showcase: typed style contracts. TripCard accepts StyleX overrides for layout only, so callers
// (people or agents) can't restyle its colors or spacing. Passing a style that sets `color` is a
// type error, and allowed overrides win deterministically because the caller's style merges last.
import type { StyleXStyles } from "@stylexjs/stylex";
import { Rocket } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { content } from "@/content";

export type TripCardStyle = StyleXStyles<{
  marginBlock?: string | number;
  inlineSize?: string | number;
  maxInlineSize?: string | number;
}>;

export function TripCard({ style }: { style?: TripCardStyle }) {
  return (
    <Card
      style={style}
      title={content.card.title}
      items={content.card.items}
      footer={
        <Button variant="primary" size="medium" icon={Rocket}>
          {content.actions.primary}
        </Button>
      }
    />
  );
}
