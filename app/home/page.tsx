import { SearchForm } from "@/components/search-form";
import { Search, Bot, Users, Heart } from "lucide-react";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"] });

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="min-h-screen flex flex-col items-center justify-center px-4">
          {/* Logo */}
          <div className="mb-16 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg">
              <Heart className="w-7 h-7 text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent">
              MediConnect
            </span>
          </div>

          <div className="container max-w-4xl mx-auto text-center space-y-16">
            <div className="space-y-6">
              <h1
                className={`${outfit.className} text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-b from-white via-gray-200 to-gray-400 bg-clip-text text-transparent drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]`}
              >
                Find Healthcare Support{" "}
                <span className="block mt-2">Near You</span>
              </h1>
              <p
                className={`${outfit.className} text-lg text-muted-foreground max-w-2xl mx-auto`}
              >
                Connect with hospitals in your area and get instant support
                through AI-powered chat or speak with hospital staff directly.
              </p>
            </div>

            {/* Search Box */}
            <SearchForm />

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="group flex flex-col items-center p-6 rounded-xl border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                  <Search className="w-7 h-7 text-blue-500" />
                </div>
                <h3
                  className={`${outfit.className} text-lg font-semibold mb-2`}
                >
                  Find Hospitals
                </h3>
                <p
                  className={`${outfit.className} text-sm text-muted-foreground text-center`}
                >
                  Easily locate hospitals in your area using your pincode
                </p>
              </div>
              <div className="group flex flex-col items-center p-6 rounded-xl border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                  <Bot className="w-7 h-7 text-emerald-500" />
                </div>
                <h3
                  className={`${outfit.className} text-lg font-semibold mb-2`}
                >
                  AI Support
                </h3>
                <p
                  className={`${outfit.className} text-sm text-muted-foreground text-center`}
                >
                  Get instant answers from our AI-powered chatbot
                </p>
              </div>
              <div className="group flex flex-col items-center p-6 rounded-xl border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="w-14 h-14 rounded-full bg-violet-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-violet-500/20 transition-all duration-300">
                  <Users className="w-7 h-7 text-violet-500" />
                </div>
                <h3
                  className={`${outfit.className} text-lg font-semibold mb-2`}
                >
                  Human Support
                </h3>
                <p
                  className={`${outfit.className} text-sm text-muted-foreground text-center`}
                >
                  Connect with hospital staff when you need personal assistance
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
