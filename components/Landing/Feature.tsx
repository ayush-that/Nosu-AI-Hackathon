import React from "react";
import { FeaturesSectionWithHoverEffects } from "@/components/ui/feature-section-with-hover-effects";

function Feature() {
  return (
    <div className="min-h-screen w-full">
      <div className="absolute left-0 w-full">
        <h1 className="text-4xl font-bold">Key Features</h1>
        <FeaturesSectionWithHoverEffects />
      </div>
    </div>
  );
}

export default Feature;
