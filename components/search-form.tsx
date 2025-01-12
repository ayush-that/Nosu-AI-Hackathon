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
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="relative flex items-center">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Enter your pincode..."
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="w-full pl-5 pr-32 h-14 text-lg bg-background/60 backdrop-blur border-muted-foreground/20 rounded-2xl focus-visible:ring-primary/50 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
          />
          <Button
            type="submit"
            size="lg"
            className="absolute right-1.5 top-1.5 h-11 rounded-xl gap-2 text-base font-medium hover:bg-primary/90"
          >
            <Search className="w-4 h-4" />
            Search
          </Button>
        </div>
      </div>
    </form>
  );
}
