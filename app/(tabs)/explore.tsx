import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, View, useWindowDimensions } from "react-native";

import { AppCard } from "@/components/design/app-card";
import { AppScreen } from "@/components/design/app-screen";
import { AppText } from "@/components/design/app-text";
import { TopAppBar } from "@/components/design/top-app-bar";
import { useThemeColor } from "@/hooks/use-theme-color";

const DOMAINS = [
  {
    key: "logic",
    title: "Logic Systems",
    subtitle: "Algorithms & Complexity",
    icon: "account-tree",
  },
  {
    key: "math",
    title: "Math for Systems",
    subtitle: "Discrete & Applied",
    icon: "functions",
  },
  {
    key: "coding",
    title: "Coding Syntax",
    subtitle: "Patterns & Craft",
    icon: "code",
  },
  {
    key: "ds",
    title: "Data Structures",
    subtitle: "Trees, Graphs, Hashing",
    icon: "schema",
  },
  {
    key: "soft",
    title: "Soft Skills",
    subtitle: "Communication & Teams",
    icon: "psychology",
  },
];

export default function ExploreScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const primary = useThemeColor({}, "primary");
  const surfaceHighest = useThemeColor({}, "surfaceContainerHighest");

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
        title="Explore"
        left={<MaterialIcons name="explore" size={22} color={primary} />}
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
        <AppText variant="headline" colorName="primary">
          Domains of Study
        </AppText>
        <AppText
          variant="body"
          colorName="secondary"
          style={{ opacity: 0.85, maxWidth: 720 }}
        >
          Browse the system architecture of your curriculum. Each domain is a
          pillar with its own assessments, feedback loops, and progression.
        </AppText>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14 }}>
        {DOMAINS.map((d) => (
          <Pressable
            key={d.key}
            accessibilityRole="button"
            accessibilityLabel={`Abrir ${d.title}`}
            onPress={() => router.push("/quiz/questions" as any)}
            style={({ pressed }) => [
              {
                width: width >= 900 ? "32%" : width >= 520 ? "48%" : "100%",
                transform: [{ scale: pressed ? 0.985 : 1 }],
              },
            ]}
          >
            <AppCard tone="low" style={{ gap: 12 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: `${primary}14`,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons
                    name={d.icon as any}
                    size={22}
                    color={primary}
                  />
                </View>
                <MaterialIcons name="chevron-right" size={22} color={primary} />
              </View>
              <View style={{ gap: 4 }}>
                <AppText variant="title">{d.title}</AppText>
                <AppText
                  variant="labelCaps"
                  colorName="secondary"
                  style={{ opacity: 0.8 }}
                >
                  {d.subtitle}
                </AppText>
              </View>
            </AppCard>
          </Pressable>
        ))}
      </View>
    </AppScreen>
  );
}
