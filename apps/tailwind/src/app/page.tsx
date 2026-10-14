import { Download, Rocket } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { content } from "@/content";

export default function Home() {
  return (
    <main className="mx-auto max-w-page px-6 py-8 md:px-12">
      <header className="mb-8 flex justify-end">
        <ThemeToggle />
      </header>
      <section className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <p className="mb-3 font-bold font-mono text-accent text-small uppercase tracking-[1px]">
            {content.eyebrow}
          </p>
          <h1 className="mb-4 font-bold text-heading-small leading-[1.1] md:text-heading-medium lg:text-heading-large">
            {content.heading}
          </h1>
          <p className="max-w-[560px] text-large text-text-secondary leading-[1.6]">
            {content.description}
          </p>
        </div>
        <Card
          title={content.card.title}
          items={content.card.items}
          footer={
            <>
              <Button variant="secondary" size="medium">
                <Download aria-hidden />
                {content.actions.secondary}
              </Button>
              <Button variant="primary" size="large">
                <Rocket aria-hidden />
                {content.actions.primary}
              </Button>
            </>
          }
        />
      </section>
    </main>
  );
}
