import { cn } from "@/lib/utils";
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from "@tabler/icons-react";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "AI-Powered Health Insights",
      description:
        "Personalized health recommendations and predictive analytics powered by advanced AI.",
      icon: <IconAdjustmentsBolt className="w-8 h-8" />,
      color: "from-blue-500/20 to-blue-500/0",
    },
    {
      title: "User-Friendly Patient Portal",
      description:
        "Easy access to health records, appointments, and communication with providers.",
      icon: <IconHelp className="w-8 h-8" />,
      color: "from-purple-500/20 to-purple-500/0",
    },
    {
      title: "Cost-Effective Healthcare Solutions",
      description:
        "Optimize costs with efficient resource allocation and high-quality care.",
      icon: <IconRouteAltLeft className="w-8 h-8" />,
      color: "from-green-500/20 to-green-500/0",
    },
    {
      title: "Reliable and Secure Platform",
      description:
        "High availability and robust security for sensitive patient data.",
      icon: <IconCloud className="w-8 h-8" />,
      color: "from-rose-500/20 to-rose-500/0",
    },
    {
      title: "Scalable for All Healthcare Needs",
      description:
        "Scales from small clinics to large hospitals, adapting to growing demands.",
      icon: <IconCurrencyDollar className="w-8 h-8" />,
      color: "from-amber-500/20 to-amber-500/0",
    },
    {
      title: "24/7 Dedicated Support",
      description:
        "Round-the-clock support from healthcare professionals and AI assistance.",
      icon: <IconEaseInOut className="w-8 h-8" />,
      color: "from-indigo-500/20 to-indigo-500/0",
    },
  ];

  return (
    <section className="py-16 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
  color,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
  color: string;
}) => {
  return (
    <div
      className={cn(
        "group/feature relative rounded-2xl p-6 transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1",
        "bg-background/50 backdrop-blur-sm",
        "border border-border/50",
        "sm:p-8"
      )}
    >
      {/* Gradient Background Effect */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover/feature:opacity-100",
          "transition-opacity duration-300 rounded-2xl bg-gradient-to-b",
          color
        )}
      />

      {/* Icon Container */}
      <div className="relative mb-4 sm:mb-6">
        <div
          className={cn(
            "inline-flex items-center justify-center",
            "p-3 rounded-xl bg-background/80",
            "ring-1 ring-border/50 shadow-sm",
            "transition-transform duration-300",
            "group-hover/feature:scale-110"
          )}
        >
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className="relative space-y-3">
        <h3 className="text-lg font-semibold leading-tight tracking-tight sm:text-xl">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed sm:text-base">
          {description}
        </p>
      </div>

      {/* Hover Indicator */}
      <div
        className={cn(
          "absolute left-0 top-8 h-12 w-1",
          "opacity-0 group-hover/feature:opacity-100",
          "transition-all duration-300",
          "bg-gradient-to-b from-rose-500 to-rose-600",
          "rounded-r-full"
        )}
      />
    </div>
  );
};
