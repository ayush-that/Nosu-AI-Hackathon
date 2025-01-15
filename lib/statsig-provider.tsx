"use client";

import { StatsigProvider as Provider } from "statsig-react";
import { useAuth } from "./auth-context";

export function StatsigProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const statsigUser = user
    ? {
        userID: user.id,
        email: user.email,
        custom: {
          provider: user.app_metadata?.provider || "email",
        },
      }
    : {
        userID: "anonymous",
      };

  return (
    <Provider
      sdkKey={process.env.NEXT_PUBLIC_STATSIG_CLIENT_SDK_KEY || ""}
      user={statsigUser}
      waitForInitialization={false}
      options={{
        environment: {
          tier:
            process.env.NODE_ENV === "production"
              ? "production"
              : "development",
        },
      }}
    >
      {children}
    </Provider>
  );
}
