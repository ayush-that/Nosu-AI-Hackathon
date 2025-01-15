"use client";

import React from "react";
import { LogLevel, StatsigProvider } from "@statsig/react-bindings";
import { StatsigAutoCapturePlugin } from "@statsig/web-analytics";

export default function MyStatsig({ children }: { children: React.ReactNode }) {
  return (
    <StatsigProvider
      sdkKey={process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!}
      loadingComponent={
        <div style={{ height: 100, width: 300, padding: 16 }}>Loading...</div>
      }
      user={{ userID: "optional" }}
      options={{
        logLevel: LogLevel.Debug,
        plugins: [new StatsigAutoCapturePlugin()],
      }}
    >
      {children}
    </StatsigProvider>
  );
}
