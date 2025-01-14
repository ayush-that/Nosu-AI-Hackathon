"use client";
import { cn } from "@/lib/utils";
import React from "react";
import {
  TestimonialCard,
  TestimonialAuthor,
} from "@/components/ui/testimonial-card";
import { useRef, useEffect } from "react";

interface TestimonialsSectionProps {
  title: string;
  description: string;
  testimonials: Array<{
    author: TestimonialAuthor;
    text: string;
    href?: string;
  }>;
  className?: string;
}

export function TestimonialsSection({
  title,
  description,
  testimonials,
  className,
}: TestimonialsSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !innerRef.current) return;

    const container = containerRef.current;
    const inner = innerRef.current;
    const duration =
      parseFloat(getComputedStyle(inner).getPropertyValue("--duration")) * 1000; // Convert to milliseconds

    let animationFrameId: number;

    const animate = () => {
      if (!innerRef.current) return;
      const progress = inner.offsetLeft / inner.scrollWidth; // Get the progress of the animation
      if (progress <= -0.99) {
        // Adjust this threshold as needed
        inner.style.transform = `translateX(0)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <section
      className={cn(
        "bg-background text-foreground",
        "py-12 sm:py-24 md:py-32 px-0",
        className
      )}
    >
      <div className="mx-auto flex max-w-container flex-col items-center gap-4 text-center sm:gap-16">
        <div className="flex flex-col items-center gap-4 px-4 sm:gap-8">
          <h2 className="max-w-[720px] text-3xl font-semibold leading-tight sm:text-5xl sm:leading-tight">
            {title}
          </h2>
          <p className="text-md max-w-[600px] font-medium text-muted-foreground sm:text-xl">
            {description}
          </p>
        </div>

        <div
          className="relative flex w-full flex-col items-center justify-center overflow-hidden"
          ref={containerRef}
        >
          <div
            className="group flex  p-2 [--gap:1rem] [gap:var(--gap)] flex-nowrap [--duration:40s]"
            ref={innerRef}
            style={{ animationPlayState: "running" }} // Ensure animation starts
          >
            <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-nowrap group-hover:[animation-play-state:paused]">
              {/* Duplicate testimonials to create the illusion of infinite scroll */}
              {[...Array(3)].map((_, setIndex) => (
                <React.Fragment key={`set-${setIndex}`}>
                  {testimonials.map((testimonial, i) => (
                    <TestimonialCard
                      key={`${setIndex}-${i}`}
                      {...testimonial}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>
            {/* Duplicate again at the end for smoother transition */}
            <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-nowrap group-hover:[animation-play-state:paused]">
              {testimonials.map((testimonial, i) => (
                <TestimonialCard key={`end-${i}`} {...testimonial} />
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-background sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-background sm:block" />
        </div>
      </div>
    </section>
  );
}
