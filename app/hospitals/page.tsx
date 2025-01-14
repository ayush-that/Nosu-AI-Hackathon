"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageSquare, MapPin } from "lucide-react";
import {
  getPincodeCoordinates,
  getHospitalsNearby,
  formatHospitalData,
} from "@/lib/openstreetmap";
import { toast } from "@/components/ui/use-toast";

interface Hospital {
  id: string;
  name: string;
  distance: number;
  address: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}

function HospitalSkeleton() {
  return (
    <div className="group p-6 rounded-xl border bg-card animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Hospital name skeleton */}
          <div className="h-7 bg-muted-foreground/20 rounded w-48 mb-3" />

          {/* Address skeleton */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 rounded-full bg-muted-foreground/20" />
            <div className="h-4 bg-muted-foreground/20 rounded w-64" />
          </div>

          {/* View on map link skeleton */}
          <div className="h-4 bg-muted-foreground/20 rounded w-24" />
        </div>

        {/* Chat button skeleton */}
        <div className="w-32 h-9 bg-muted-foreground/20 rounded" />
      </div>
    </div>
  );
}

export default function HospitalsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pincode = searchParams.get("pincode");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      if (!pincode) return;

      setLoading(true);
      setError(null);

      try {
        // Convert pincode to coordinates
        const coords = await getPincodeCoordinates(pincode);

        // Get hospitals near those coordinates
        const osmHospitals = await getHospitalsNearby(coords);

        // Format the hospital data
        const formattedHospitals = osmHospitals
          .map((hospital) =>
            formatHospitalData(hospital, coords.lat, coords.lon)
          )
          .sort((a, b) => a.distance - b.distance); // Sort by distance

        setHospitals(formattedHospitals);
      } catch (err) {
        console.error("Error fetching hospitals:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch hospitals"
        );
        toast({
          title: "Error",
          description:
            err instanceof Error ? err.message : "Failed to fetch hospitals",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [pincode]);

  const handleChatClick = (hospitalId: string) => {
    router.push(`/auth`);
  };

  if (!pincode) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 container max-w-4xl mx-auto p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">No pincode provided</h1>
            <p className="text-muted-foreground mb-4">
              Please search with a valid pincode
            </p>
            <Button onClick={() => router.push("/")}>Go Back</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Hospitals near {pincode}</h1>
          <p className="text-muted-foreground">
            {error ? (
              <span className="text-destructive">{error}</span>
            ) : (
              `Found ${hospitals.length} hospitals in your area`
            )}
          </p>
        </div>

        <div className="grid gap-4">
          {loading
            ? // Show 3 skeleton cards while loading
              [...Array(3)].map((_, i) => <HospitalSkeleton key={i} />)
            : hospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="group p-6 rounded-xl border bg-card hover:bg-card/80 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        {hospital.name}
                      </h2>
                      <div className="flex items-center gap-2 text-muted-foreground mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{hospital.address}</span>
                        <span className="text-sm">
                          ({hospital.distance.toFixed(1)} km away)
                        </span>
                      </div>
                      <a
                        href={`https://www.openstreetmap.org/?mlat=${hospital.coordinates.lat}&mlon=${hospital.coordinates.lon}#map=16/${hospital.coordinates.lat}/${hospital.coordinates.lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        View on Map
                      </a>
                    </div>
                    <Button
                      onClick={() => handleChatClick(hospital.id)}
                      className="gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Chat Support
                    </Button>
                  </div>
                </div>
              ))}
        </div>
      </main>
    </div>
  );
}
