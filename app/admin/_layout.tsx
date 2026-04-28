import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

export default function AdminLayout() {
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
        if (!cancelled) setIsAuthChecked(true);
        return;
      }

      if (roleId === 2 || roleId === "2") {
        router.replace("/(tabs)");
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

  return <Stack screenOptions={{ headerShown: false }} />;
}
