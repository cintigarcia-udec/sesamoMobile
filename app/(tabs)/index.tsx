import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  View,
  useWindowDimensions,
} from "react-native";

import { AppButton } from "@/components/design/app-button";
import { AppCard } from "@/components/design/app-card";
import { AppScreen } from "@/components/design/app-screen";
import { AppText } from "@/components/design/app-text";
import { ProgressRing } from "@/components/design/progress-ring";
import { TopAppBar } from "@/components/design/top-app-bar";
import {
  ApiError,
  api,
  getJwtUserId,
  getStoredAccessToken,
} from "@/constants/api";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function DashboardScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const primary = useThemeColor({}, "primary");
  const surfaceHighest = useThemeColor({}, "surfaceContainerHighest");
  const surfaceLow = useThemeColor({}, "surfaceContainerLow");
  const errorContainer = useThemeColor({}, "errorContainer");
  const onErrorContainer = useThemeColor({}, "onErrorContainer");
  const error = useThemeColor({}, "error");

  const [avgScore, setAvgScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setIsLoading(true);
      setLoadError("");
      try {
        const token = await getStoredAccessToken();
        const userId = token ? getJwtUserId(token) : null;
        if (!userId) {
          setLoadError("No se pudo determinar el usuario actual desde el JWT.");
          return;
        }
        const responses = await api.userResponses.list({
          skip: 0,
          limit: 2000,
        });
        const mine = responses.filter((r) => r.user_id === userId);
        const overallAvg =
          mine.reduce(
            (acc, it) => acc + (Number.isFinite(it.score) ? it.score : 0),
            0,
          ) / Math.max(1, mine.length);
        if (cancelled) return;
        setAvgScore(Number.isFinite(overallAvg) ? overallAvg : 0);
      } catch (err) {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError
            ? err.message
            : "No se pudo cargar tu dashboard.",
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const pillars = useMemo(
    () => [
      {
        key: "logic",
        title: "Logic",
        icon: "account-tree",
        tone: "primary",
        status: "In Progress",
      },
      {
        key: "math",
        title: "Math",
        icon: "functions",
        tone: "tertiary",
        status: "Action Req",
      },
      {
        key: "coding",
        title: "Coding",
        icon: "code",
        tone: "surfaceTint",
        status: "Completed",
      },
      {
        key: "db",
        title: "Databases",
        icon: "database",
        tone: "secondary",
        status: "Locked",
        disabled: true,
      },
      {
        key: "soft",
        title: "Soft Skills",
        icon: "psychology",
        tone: "tertiaryFixedDim",
        status: "Not Started",
      },
    ],
    [],
  );

  const isWide = width >= 900;

  return (
    <AppScreen
      contentContainerStyle={{
        paddingTop: 92,
        paddingHorizontal: 20,
        maxWidth: 1100,
        width: "100%",
        alignSelf: "center",
        gap: 18,
      }}
    >
      <TopAppBar
        title="ENGINEERING_LOG"
        left={<MaterialIcons name="terminal" size={22} color={primary} />}
        right={
          <View
            accessibilityLabel="Perfil"
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              backgroundColor: surfaceHighest,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppText variant="labelCaps" colorName="primary">
              AR
            </AppText>
          </View>
        }
      />

      <View style={{ gap: 6 }}>
        <AppText variant="headline" colorName="onSurface">
          Dashboard: Engineer Console
        </AppText>
        {isLoading ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <ActivityIndicator color={primary} />
            <AppText
              variant="body"
              colorName="secondary"
              style={{ opacity: 0.85 }}
            >
              Cargando métricas...
            </AppText>
          </View>
        ) : (
          <AppText
            variant="body"
            colorName="secondary"
            style={{ opacity: 0.85 }}
          >
            {loadError
              ? loadError
              : avgScore === null
                ? "Sin métricas disponibles."
                : `Promedio de puntaje: ${avgScore.toFixed(1)}/100`}
          </AppText>
        )}
      </View>

      <View
        accessibilityRole="alert"
        style={{
          backgroundColor: errorContainer,
          borderRadius: 14,
          padding: 14,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <View
          style={{
            width: 4,
            alignSelf: "stretch",
            borderRadius: 999,
            backgroundColor: error,
          }}
        />
        <MaterialIcons
          name="priority-high"
          size={20}
          color={onErrorContainer}
        />
        <AppText
          variant="label"
          colorName="onErrorContainer"
          style={{ flex: 1 }}
        >
          1 Timed Evaluation Expiring in 2 hours: {"'Math for Systems'"}
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar alerta"
          onPress={() => {}}
        >
          <MaterialIcons name="close" size={18} color={onErrorContainer} />
        </Pressable>
      </View>

      <View style={{ flexDirection: isWide ? "row" : "column", gap: 16 }}>
        <AppCard
          tone="lowest"
          style={{
            flex: isWide ? 5 : undefined,
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
          }}
        >
          <ProgressRing
            value={
              avgScore === null ? 0 : Math.max(0, Math.min(1, avgScore / 100))
            }
            label="Promedio"
          />
          <View style={{ alignItems: "center", gap: 2 }}>
            <AppText variant="title" colorName="onSurface">
              {avgScore === null
                ? "Sin datos"
                : `${Math.round(avgScore)} / 100`}
            </AppText>
            <AppText
              variant="body"
              colorName="secondary"
              style={{ fontSize: 13, opacity: 0.9 }}
            >
              Resultados basados en tus envíos de cuestionarios.
            </AppText>
          </View>
        </AppCard>

        <AppCard
          tone="lowest"
          style={{
            flex: isWide ? 7 : undefined,
            padding: 0,
            overflow: "hidden",
          }}
        >
          <View style={{ padding: 22, gap: 14 }}>
            <AppText
              variant="labelCaps"
              colorName="inverseOnSurface"
              style={{ opacity: 0.8 }}
            >
              Active Thread
            </AppText>
            <AppText
              variant="headline"
              colorName="inverseOnSurface"
              style={{ fontSize: 26, lineHeight: 32 }}
            >
              Continue Logic & Algorithms
            </AppText>

            <View
              style={{
                alignSelf: "flex-start",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.12)",
              }}
            >
              <MaterialIcons name="layers" size={16} color="#ffffff" />
              <AppText variant="label" style={{ color: "#ffffff" }}>
                Module 04/06
              </AppText>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 10,
                gap: 14,
              }}
            >
              <View
                style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 999,
                    backgroundColor: surfaceHighest,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AppText variant="labelCaps" colorName="primary">
                    A
                  </AppText>
                </View>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 999,
                    backgroundColor: surfaceHighest,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AppText variant="labelCaps" colorName="secondary">
                    +12
                  </AppText>
                </View>
              </View>

              <AppButton
                onPress={() => router.push("/quiz/questions" as any)}
                variant="secondary"
                rightIcon={
                  <MaterialIcons
                    name="arrow-forward"
                    size={18}
                    color={primary}
                  />
                }
              >
                RESUME SESSION
              </AppButton>
            </View>
          </View>
          <View
            style={{
              backgroundColor: primary,
              height: "100%",
              position: "absolute",
              inset: 0,
              opacity: 0.95,
            }}
          />
        </AppCard>
      </View>

      <View style={{ gap: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <AppText variant="title">Knowledge Pillars</AppText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ver todos los dominios"
            onPress={() => router.push("/(tabs)/explore")}
          >
            <AppText variant="labelCaps" colorName="primary">
              View All Domains
            </AppText>
          </Pressable>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {pillars.map((p) => (
            <Pressable
              key={p.key}
              accessibilityRole="button"
              accessibilityLabel={`Abrir ${p.title}`}
              disabled={p.disabled}
              onPress={() => router.push("/(tabs)/explore")}
              style={({ pressed }) => [
                {
                  width: width >= 900 ? "19%" : width >= 520 ? "31%" : "48%",
                  borderRadius: 18,
                  padding: 16,
                  backgroundColor: surfaceLow,
                  opacity: p.disabled ? 0.6 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: `${primary}1a`,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons name={p.icon as any} size={22} color={primary} />
              </View>
              <View style={{ marginTop: 12, gap: 4 }}>
                <AppText variant="bodyStrong" colorName="onSurface">
                  {p.title}
                </AppText>
                <AppText
                  variant="labelCaps"
                  colorName="secondary"
                  style={{ opacity: 0.8 }}
                >
                  {p.status}
                </AppText>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      <AppCard tone="low" style={{ gap: 12 }}>
        <View style={{ gap: 4 }}>
          <AppText variant="title">Weekly Activity</AppText>
          <AppText
            variant="body"
            colorName="secondary"
            style={{ fontSize: 13, opacity: 0.9 }}
          >
            Tracking study minutes across all systems.
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
            style={{ width: "62%", height: "100%", backgroundColor: primary }}
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <AppText
            variant="labelCaps"
            colorName="secondary"
            style={{ opacity: 0.7 }}
          >
            This week: 186 min
          </AppText>
          <AppText
            variant="labelCaps"
            colorName="secondary"
            style={{ opacity: 0.7 }}
          >
            Target: 300 min
          </AppText>
        </View>
      </AppCard>
    </AppScreen>
  );
}
