import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const decodeBase64Url = (value: string) => {
        const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
        const padded =
          normalized + "=".repeat((4 - (normalized.length % 4)) % 4);

        const atobFn = (
          globalThis as unknown as {
            atob?: (s: string) => string;
          }
        ).atob;
        if (atobFn) return atobFn(padded);

        const bufferCtor = (globalThis as unknown as { Buffer?: any }).Buffer;
        if (bufferCtor?.from) {
          return bufferCtor.from(padded, "base64").toString("binary");
        }

        throw new Error("Base64 decode not available");
      };

      const getJwtPayload = (token: string) => {
        const parts = token.split(".");
        if (parts.length < 2) return null;
        try {
          const json = decodeBase64Url(parts[1]!);
          return JSON.parse(json) as Record<string, unknown>;
        } catch {
          return null;
        }
      };

      const ACCESS_TOKEN_KEY = "sesamo.access_token";
      const inMemory = (globalThis as any).__SESAMO_ACCESS_TOKEN__ as
        | string
        | undefined;

      let token: string | null | undefined = inMemory;

      if (!token) {
        if (process.env.EXPO_OS === "web") {
          try {
            token = (globalThis as any).localStorage?.getItem(ACCESS_TOKEN_KEY);
          } catch {
            token = null;
          }
        } else {
          try {
            const available = await SecureStore.isAvailableAsync();
            token = available
              ? await SecureStore.getItemAsync(ACCESS_TOKEN_KEY)
              : null;
          } catch {
            token = null;
          }
        }
      }

      if (!token) {
        router.replace("/auth/login");
        return;
      }

      const payload = getJwtPayload(token);
      const roleId = payload?.role_id;

      if (roleId === 1 || roleId === "1") {
        router.replace("/admin");
        return;
      }

      if (roleId === 2 || roleId === "2") {
        if (!cancelled) setIsAuthChecked(true);
        return;
      }

      router.replace("/auth/login");
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!isAuthChecked) return null;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size ?? 28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="explore" size={size ?? 28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="insights" size={size ?? 28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size ?? 28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
