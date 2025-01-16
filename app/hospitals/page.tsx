"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageSquare, MapPin, Hospital } from "lucide-react";
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
          <div className="h-7 bg-muted-foreground/20 rounded w-48 mb-3" />
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 rounded-full bg-muted-foreground/20" />
            <div className="h-4 bg-muted-foreground/20 rounded w-64" />
          </div>
          <div className="h-4 bg-muted-foreground/20 rounded w-24" />
        </div>
        <div className="w-32 h-9 bg-muted-foreground/20 rounded" />
      </div>
    </div>
  );
}

function HospitalsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pincode = searchParams.get("pincode");
    if (!pincode) {
      router.push("/");
      return;
    }

    const fetchHospitals = async () => {
      try {
        const coordinates = await getPincodeCoordinates(pincode);
        if (!coordinates) {
          toast({
            title: "Error",
            description: "Could not find coordinates for the pincode",
            variant: "destructive",
          });
          router.push("/");
          return;
        }

        const nearbyHospitals = await getHospitalsNearby(coordinates);
        const formattedHospitals = nearbyHospitals.map((hospital) =>
          formatHospitalData(hospital, coordinates.lat, coordinates.lon)
        );
        setHospitals(formattedHospitals);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
        toast({
          title: "Error",
          description: "Failed to fetch hospitals. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [searchParams, router]);

  const handleChatClick = (hospitalId: string) => {
    router.push(`/auth?hospital=${hospitalId}`);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <HospitalSkeleton />
        <HospitalSkeleton />
        <HospitalSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:p-0 p-4 ">
      {hospitals.map((hospital) => (
        <div
          key={hospital.id}
          className="group p-6 rounded-xl border bg-card hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">{hospital.name}</h3>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" />
                <span>{hospital.address}</span>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${hospital.coordinates.lat},${hospital.coordinates.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                View on map
              </a>
            </div>
            <Button
              variant="secondary"
              className="gap-2"
              onClick={() => handleChatClick(hospital.id)}
            >
              <MessageSquare className="h-4 w-4" />
              Chat
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HospitalsPage() {
  return (
    <div className="container max-w-3xl py-8 justify-center items-center  mx-auto flex flex-col min-h-screen">
      <div className="md:flex md:flex-row items-center mb-6 gap-3 flex-col flex ">
        <h1 className=" text-3xl md:text-4xl font-bold">
          Nearby Hospitals
        </h1>
        <Hospital className="w-8 h-8 text-red-400 animate-pulse" />
      </div>

      <Suspense
        fallback={
          <div className="space-y-4 ">
            <HospitalSkeleton />
            <HospitalSkeleton />
            <HospitalSkeleton />
          </div>
        }
      >
        <HospitalsContent />
      </Suspense>
    </div>
  );
}
