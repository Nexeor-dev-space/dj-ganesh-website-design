import { Hero } from "@/components/hero/Hero";
import { Navbar } from "@/components/navigation/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
      </main>
    </>
  );
}
