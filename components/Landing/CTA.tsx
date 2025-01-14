import React from "react";
import { Button } from "@/components/ui/button";
import { MoveRight, PhoneCall } from "lucide-react";

function CTA() {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center gap-8">
          {/* Headline */}
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight max-w-2xl">
            Ready to Transform Your Healthcare Experience?
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Join thousands of users who are already benefiting from
            MediConnect's innovative solutions. Whether you're a patient or a
            healthcare provider, we're here to make healthcare simpler, faster,
            and more effective.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="gap-2">
              Get Started <MoveRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              Contact Us <PhoneCall className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
