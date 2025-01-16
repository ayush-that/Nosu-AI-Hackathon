import  Hero  from "@/components/Landing/Hero";
import Feature from "@/components/Landing/Feature";
import Footer from "@/components/Landing/Footer";
import { Testimonials } from "@/components/Landing/Testinomial";
import CTA from "@/components/Landing/CTA";
import Header from "@/components/Landing/header";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="flex flex-col items-center px-4  py-0 md:-mt-10 sm:-mt-5 -mt-10">
          <div className="container max-w-4xl mx-auto text-center space-y-5 ">
            <Hero />
            <Feature />
            <Testimonials />
            <CTA />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
