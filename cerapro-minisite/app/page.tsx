import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProductSlider from "@/components/FeaturedProductSlider";
import Produitsetsolutions from "@/components/produitsetsolutions";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <FeaturedProductSlider />
      <Produitsetsolutions />
    </main>
  );
}