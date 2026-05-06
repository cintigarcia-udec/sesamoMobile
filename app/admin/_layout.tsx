import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { getJwtRoleId, getStoredAccessToken } from "@/constants/api";

export default function AdminLayout() {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const token = await getStoredAccessToken();

      if (!token) {
        router.replace("/auth/login");
        return;
      }

      const roleId = getJwtRoleId(token);

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
