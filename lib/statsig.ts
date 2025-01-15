import { useGate, useExperiment, useConfig } from "statsig-react";

// Feature Gates
export function useFeatureGate(gateName: string) {
  return useGate(gateName);
}

// Experiments
export function useStatsigExperiment(experimentName: string) {
  return useExperiment(experimentName);
}

// Dynamic Configs
export function useStatsigConfig(configName: string) {
  return useConfig(configName);
}

// Custom event logging
export function logEvent(
  eventName: string,
  value?: string | number,
  metadata?: Record<string, string>
) {
  if (typeof window !== "undefined") {
    // @ts-ignore - Statsig adds this to window
    window.statsig?.logEvent(eventName, value, metadata);
  }
}
