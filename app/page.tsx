import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  return (
    <main className="flex min-h-dvh items-center">
      <Container>
        <h1 className="text-3xl font-semibold tracking-tight uppercase">
          {siteConfig.name}
        </h1>
        <p className="mt-sm text-muted-foreground">Website in development</p>
      </Container>
    </main>
  );
}
