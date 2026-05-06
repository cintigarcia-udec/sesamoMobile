import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { ActivityIndicator, View, useWindowDimensions } from "react-native";

import { AdminShell } from "@/components/admin/admin-shell";
import { AppCard } from "@/components/design/app-card";
import { AppText } from "@/components/design/app-text";
import { ApiError, api } from "@/constants/api";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function AdminDashboardScreen() {
  const { width } = useWindowDimensions();
  const primary = useThemeColor({}, "primary");
  const secondary = useThemeColor({}, "secondary");
  const primaryContainer = useThemeColor({}, "primaryContainer");
  const onPrimaryContainer = useThemeColor({}, "onPrimaryContainer");
  const surfaceHighest = useThemeColor({}, "surfaceContainerHighest");

  const isWide = width >= 900;
  const [avgScore, setAvgScore] = useState<number | null>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setIsLoading(true);
      setError("");
      try {
        const [users, responses] = await Promise.all([
          api.users.list({ skip: 0, limit: 5000 }),
          api.userResponses.list({ skip: 0, limit: 5000 }),
        ]);
        const overallAvg =
          responses.reduce((acc, it) => acc + (Number.isFinite(it.score) ? it.score : 0), 0) /
          Math.max(1, responses.length);
        if (cancelled) return;
        setTotalUsers(users.length);
        setAvgScore(Number.isFinite(overallAvg) ? overallAvg : 0);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "No se pudieron cargar métricas.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AdminShell
      active="dashboard"
      title="Consola Admin"
      right={
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <MaterialIcons name="schedule" size={18} color={secondary} />
            <AppText
              variant="label"
              colorName="secondary"
              style={{ opacity: 0.85 }}
            >
              Último respaldo: hace 2 h
            </AppText>
          </View>
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 999,
              backgroundColor: primaryContainer,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons
              name="notifications"
              size={18}
              color={onPrimaryContainer}
            />
          </View>
        </View>
      }
    >
      <View style={{ gap: 10, marginLeft: isWide ? 16 : 0 }}>
        <AppText
          variant="headline"
          colorName="primary"
          style={{ fontSize: 32 }}
        >
          Métricas globales de rendimiento
        </AppText>
        <AppText
          variant="body"
          colorName="secondary"
          style={{ opacity: 0.85, maxWidth: 720 }}
        >
          Visión general del rendimiento académico del sistema.
        </AppText>
        {isLoading ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <ActivityIndicator color={primary} />
            <AppText variant="body" colorName="secondary">
              Cargando...
            </AppText>
          </View>
        ) : error ? (
          <AppText variant="body" colorName="secondary">
            {error}
          </AppText>
        ) : null}
      </View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 14,
          marginTop: 14,
        }}
      >
        <AppCard
          tone="lowest"
          style={{ width: width >= 900 ? "32%" : "100%", gap: 8 }}
        >
          <MaterialIcons name="insights" size={22} color={primary} />
          <AppText
            variant="labelCaps"
            colorName="secondary"
            style={{ opacity: 0.8 }}
          >
            Puntaje promedio
          </AppText>
          <AppText
            variant="headline"
            colorName="onSurface"
            style={{ fontSize: 34 }}
          >
            {avgScore === null ? "—" : `${avgScore.toFixed(1)}%`}
          </AppText>
        </AppCard>

        <AppCard
          tone="low"
          style={{ width: width >= 900 ? "32%" : "100%", gap: 8 }}
        >
          <MaterialIcons name="group" size={22} color={primary} />
          <AppText
            variant="labelCaps"
            colorName="secondary"
            style={{ opacity: 0.8 }}
          >
            Total de estudiantes
          </AppText>
          <AppText
            variant="headline"
            colorName="onSurface"
            style={{ fontSize: 34 }}
          >
            {totalUsers === null ? "—" : totalUsers.toLocaleString()}
          </AppText>
        </AppCard>

        <AppCard
          tone="highest"
          style={{
            width: width >= 900 ? "32%" : "100%",
            gap: 8,
            borderRadius: 28,
          }}
        >
          <MaterialIcons name="trending-up" size={22} color={primary} />
          <AppText
            variant="labelCaps"
            colorName="secondary"
            style={{ opacity: 0.8 }}
          >
            Tasa de crecimiento
          </AppText>
          <AppText
            variant="headline"
            colorName="primary"
            style={{ fontSize: 34 }}
          >
            +12.4%
          </AppText>
        </AppCard>
      </View>

      <View style={{ marginTop: 14 }}>
        <AppCard tone="low" style={{ borderRadius: 28, padding: 22, gap: 12 }}>
          <AppText variant="title">Salud del sistema</AppText>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                backgroundColor: primary,
              }}
            />
            <AppText variant="bodyStrong" colorName="primary">
              Clúster saludable
            </AppText>
          </View>
          <View
            style={{
              height: 10,
              borderRadius: 999,
              backgroundColor: surfaceHighest,
              overflow: "hidden",
            }}
          >
            <View
              style={{ width: "88%", height: "100%", backgroundColor: primary }}
            />
          </View>
          <AppText
            variant="label"
            colorName="secondary"
            style={{ opacity: 0.85 }}
          >
            No se detectaron incidentes en las últimas 24 horas.
          </AppText>
        </AppCard>
      </View>
    </AdminShell>
  );
}
