import Header from "@/components/Landing/header";
import { Hero } from "@/components/Landing/Hero";
import { Outfit } from "next/font/google";
import Feature from "@/components/Landing/Feature";
import Footer from "@/components/Landing/Footer";
import { Testimonials } from "@/components/Landing/Testinomial";
import CTA from "@/components/Landing/CTA";

const outfit = Outfit({ subsets: ["latin"] });

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4">
          <div className="container max-w-4xl mx-auto text-center space-y-5">
            <Hero />
            <Feature />
            <Testimonials />
            <CTA />
            <Footer />
          </div>
        </section>
      </main>
    </div>
  );
}
