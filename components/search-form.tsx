"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchForm() {
  const [pincode, setPincode] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim()) {
      router.push(`/hospitals?pincode=${pincode}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto px-4 sm:px-0">
      <div className="relative flex items-center">
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Enter your pincode..."
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="w-full pl-4 sm:pl-5 pr-24 sm:pr-32  h-12 sm:h-14 text-base sm:text-lg bg-background/60 backdrop-blur border-muted-foreground/20 rounded-xl sm:rounded-2xl focus-visible:ring-primary/50 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
          />
          <Button
            type="submit"
            size="lg"
            className="absolute right-1 sm:right-1.5 top-1 sm:top-1.5 h-10 sm:h-11 rounded-lg sm:rounded-xl gap-1 sm:gap-2 text-sm sm:text-base font-medium hover:bg-primary/90 px-3 sm:px-4"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
