import { Hero } from "@/components/Landing/Hero";
import Feature from "@/components/Landing/Feature";
import Footer from "@/components/Landing/Footer";
import { Testimonials } from "@/components/Landing/Testinomial";
import CTA from "@/components/Landing/CTA";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="flex flex-col items-center px-4 space-y-8 py-0 md:-mt-10">
          <div className="container max-w-4xl mx-auto text-center space-y-5 ">
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
