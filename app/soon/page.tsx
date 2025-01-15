import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

function ComingSoon() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center gap-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Something Amazing is Coming Soon!
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            We're working hard to bring you an innovative healthcare solution.
            Stay tuned for the launch of New features, your trusted partner in
            healthcare.
          </p>

          <div className="w-full max-w-md">
            <form className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1"
              />
              <Button type="submit" className="gap-2">
                <Mail className="w-4 h-4" />
                Notify Me
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComingSoon;
