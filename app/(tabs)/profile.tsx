import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, View, useWindowDimensions } from "react-native";

import { AppButton } from "@/components/design/app-button";
import { AppCard } from "@/components/design/app-card";
import { AppScreen } from "@/components/design/app-screen";
import { AppText } from "@/components/design/app-text";
import { TopAppBar } from "@/components/design/top-app-bar";
import { useThemeColor } from "@/hooks/use-theme-color";

const ACCOUNT_ACTIONS = [
  { key: "security", title: "Security", icon: "shield" },
  { key: "notifications", title: "Notifications", icon: "notifications" },
  { key: "appearance", title: "Appearance", icon: "palette" },
  { key: "help", title: "Help & Support", icon: "help" },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const primary = useThemeColor({}, "primary");
  const secondary = useThemeColor({}, "secondary");
  const surfaceHighest = useThemeColor({}, "surfaceContainerHighest");
  const surfaceLowest = useThemeColor({}, "surfaceContainerLowest");
  const primaryContainer = useThemeColor({}, "primaryContainer");

  const isWide = width >= 900;

  return (
    <AppScreen
      contentContainerStyle={{
        paddingTop: 92,
        paddingHorizontal: 20,
        maxWidth: 900,
        width: "100%",
        alignSelf: "center",
        gap: 18,
      }}
    >
      <TopAppBar
        title="Engineering Journal"
        left={<MaterialIcons name="terminal" size={22} color={primary} />}
        right={
          <View
            accessibilityLabel="Avatar de usuario"
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              backgroundColor: surfaceHighest,
              borderWidth: 2,
              borderColor: primaryContainer,
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

      <View
        style={{
          flexDirection: isWide ? "row" : "column",
          gap: 18,
          alignItems: isWide ? "flex-end" : "flex-start",
        }}
      >
        <View
          style={{
            width: 132,
            height: 132,
            borderRadius: 16,
            padding: 2,
            backgroundColor: primaryContainer,
          }}
        >
          <View
            style={{
              flex: 1,
              borderRadius: 14,
              backgroundColor: surfaceLowest,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppText variant="headline" colorName="primary">
              AR
            </AppText>
          </View>
          <View
            style={{
              position: "absolute",
              right: -6,
              bottom: -6,
              width: 30,
              height: 30,
              borderRadius: 10,
              backgroundColor: primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons name="verified" size={18} color="#ffffff" />
          </View>
        </View>

        <View style={{ gap: 6 }}>
          <AppText
            variant="headline"
            colorName="onSurface"
            style={{ fontSize: 40, lineHeight: 46 }}
          >
            Alex Rivera
          </AppText>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <MaterialIcons name="architecture" size={18} color={secondary} />
            <AppText variant="labelCaps" colorName="secondary">
              Junior Architect
            </AppText>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: isWide ? "row" : "column", gap: 16 }}>
        <View style={{ flex: isWide ? 5 : undefined, gap: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
              style={{
                width: 4,
                height: 24,
                borderRadius: 999,
                backgroundColor: primary,
              }}
            />
            <AppText variant="title">Datos Personales</AppText>
          </View>

          <AppCard tone="low" style={{ borderRadius: 14, gap: 16 }}>
            <View style={{ gap: 2 }}>
              <AppText
                variant="labelCaps"
                colorName="secondary"
                style={{ opacity: 0.65 }}
              >
                Full Name
              </AppText>
              <AppText variant="bodyStrong">Alex Rivera Montoya</AppText>
            </View>
            <View style={{ gap: 2 }}>
              <AppText
                variant="labelCaps"
                colorName="secondary"
                style={{ opacity: 0.65 }}
              >
                Email Address
              </AppText>
              <AppText variant="bodyStrong">a.rivera@polytechnic.edu</AppText>
            </View>
            <View style={{ gap: 2 }}>
              <AppText
                variant="labelCaps"
                colorName="secondary"
                style={{ opacity: 0.65 }}
              >
                Institution
              </AppText>
              <AppText variant="bodyStrong">MIT School of Engineering</AppText>
            </View>
          </AppCard>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              paddingTop: 4,
            }}
          >
            <View
              style={{
                width: 4,
                height: 24,
                borderRadius: 999,
                backgroundColor: primary,
              }}
            />
            <AppText variant="title">Ajustes de Cuenta</AppText>
          </View>

          <AppCard
            tone="low"
            style={{ borderRadius: 14, padding: 0, overflow: "hidden" }}
          >
            {ACCOUNT_ACTIONS.map((a) => (
              <Pressable
                key={a.key}
                accessibilityRole="button"
                accessibilityLabel={a.title}
                onPress={() => {}}
                style={({ pressed }) => [
                  {
                    paddingHorizontal: 18,
                    paddingVertical: 16,
                    backgroundColor: pressed ? surfaceHighest : "transparent",
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <MaterialIcons
                      name={a.icon as any}
                      size={20}
                      color={secondary}
                    />
                    <AppText variant="bodyStrong">{a.title}</AppText>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={20}
                    color={`${secondary}66`}
                  />
                </View>
              </Pressable>
            ))}
          </AppCard>
        </View>

        <View style={{ flex: isWide ? 4 : undefined, gap: 16 }}>
          <AppCard tone="highest" style={{ gap: 10 }}>
            <AppText
              variant="labelCaps"
              colorName="secondary"
              style={{ opacity: 0.8 }}
            >
              Quick Actions
            </AppText>
            <AppButton
              onPress={() => router.push("/admin" as any)}
              leftIcon={
                <MaterialIcons name="dashboard" size={18} color="#ffffff" />
              }
            >
              Open Admin Console
            </AppButton>
            <AppButton
              onPress={() => router.push("/(tabs)" as any)}
              variant="secondary"
              leftIcon={<MaterialIcons name="home" size={18} color={primary} />}
            >
              Back to Dashboard
            </AppButton>
            <AppButton
              onPress={() => router.replace("/auth/login" as any)}
              variant="secondary"
              leftIcon={
                <MaterialIcons name="logout" size={18} color={primary} />
              }
              accessibilityLabel="Cerrar sesión"
            >
              Logout
            </AppButton>
          </AppCard>
        </View>
      </View>
    </AppScreen>
  );
}
