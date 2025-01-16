"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchForm } from "../search-form";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => [
      "24/7 support",
      "expert care",
      "quick response",
      "AI assistance",
      "personalized",
    ],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative bg-background">
      <div className="absolute inset-0 bg-dot-black/[0.2] dark:bg-dot-white/[0.2]">
        <div className="absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>
      
      <div className="container relative z-10 mx-auto max-w-[1200px] px-4 flex items-center justify-center">
        <div className="flex gap-8 py-12 lg:py-10 items-center justify-center flex-col text-center">
          <div className="mt-10">
            <Button variant="secondary" size="sm" className="gap-2">
              Find hospitals near you <Search className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-6 flex-col items-center">
            <h1 className="text-5xl md:text-7xl max-w-3xl tracking-tighter text-center font-regular">
              <span className="bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent">
                Your health journey begins with
              </span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>
            <SearchForm />
            <p className="text-sm md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center mx-auto">
              <span className="font-bold text-white italic">MediConnect</span> reimagines healthcare with instant access to
              hospitals, AI-powered health assistance, and direct communication
              with medical pros—your well-being, at your fingertips.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
