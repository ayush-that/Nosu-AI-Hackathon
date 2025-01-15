import React from "react";
import { FeaturesSectionWithHoverEffects } from "@/components/ui/feature-section-with-hover-effects";

function Feature() {
  return (
    <div className="min-h-screen w-full relative py-16">
      <div className="w-full">
        <h1 className="text-5xl font-bold text-center ">Key Features</h1>
        <FeaturesSectionWithHoverEffects />
      </div>
    </div>
  );
}

export default Feature;
