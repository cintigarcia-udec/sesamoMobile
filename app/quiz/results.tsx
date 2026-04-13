import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, View, useWindowDimensions } from "react-native";

import { AppButton } from "@/components/design/app-button";
import { AppCard } from "@/components/design/app-card";
import { AppScreen } from "@/components/design/app-screen";
import { AppText } from "@/components/design/app-text";
import { CodeBlock } from "@/components/design/code-block";
import { TopAppBar } from "@/components/design/top-app-bar";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function QuizResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    score?: string;
    correct?: string;
    total?: string;
    time?: string;
  }>();
  const { width } = useWindowDimensions();

  const score = Number(params.score ?? "90");
  const correct = Number(params.correct ?? "18");
  const total = Number(params.total ?? "20");
  const time = String(params.time ?? "14:22");

  const primary = useThemeColor({}, "primary");
  const primaryContainer = useThemeColor({}, "primaryContainer");
  const secondary = useThemeColor({}, "secondary");
  const surfaceHighest = useThemeColor({}, "surfaceContainerHighest");
  const surfaceLow = useThemeColor({}, "surfaceContainerLow");
  const surfaceLowest = useThemeColor({}, "surfaceContainerLowest");
  const tertiaryContainer = useThemeColor({}, "tertiaryContainer");
  const onTertiaryContainer = useThemeColor({}, "onTertiaryContainer");
  const error = useThemeColor({}, "error");

  const isWide = width >= 900;

  return (
    <AppScreen
      contentContainerStyle={{
        paddingTop: 92,
        paddingHorizontal: 20,
        maxWidth: 920,
        width: "100%",
        alignSelf: "center",
        gap: 18,
      }}
    >
      <TopAppBar
        title="Academy"
        left={
          <View
            accessibilityLabel="Avatar de usuario"
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
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Buscar"
            onPress={() => {}}
            style={({ pressed }) => [
              {
                width: 40,
                height: 40,
                borderRadius: 999,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: pressed ? surfaceLow : "transparent",
              },
            ]}
          >
            <MaterialIcons name="search" size={22} color={primaryContainer} />
          </Pressable>
        }
      />

      <View
        style={{
          borderRadius: 28,
          padding: 22,
          overflow: "hidden",
          backgroundColor: primary,
        }}
      >
        <View
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: primaryContainer,
            opacity: 0.22,
          }}
        />
        <View style={{ gap: 14 }}>
          <View
            style={{
              alignSelf: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: "rgba(255,255,255,0.10)",
            }}
          >
            <MaterialIcons name="verified" size={16} color="#ffffff" />
            <AppText variant="labelCaps" style={{ color: "#ffffff" }}>
              Assessment Complete
            </AppText>
          </View>
          <AppText
            variant="display"
            style={{
              color: "#ffffff",
              fontSize: isWide ? 78 : 60,
              lineHeight: isWide ? 82 : 64,
            }}
          >
            {score}
            <AppText
              variant="display"
              style={{
                color: "rgba(255,255,255,0.40)",
                fontSize: isWide ? 48 : 34,
                lineHeight: isWide ? 52 : 40,
              }}
            >
              /100
            </AppText>
          </AppText>
          <AppText
            variant="headline"
            style={{ color: "#ffffff", opacity: 0.9, fontSize: 24 }}
          >
            Status:{" "}
            {score >= 85
              ? "Mastered"
              : score >= 70
                ? "Validated"
                : "Needs Review"}
          </AppText>

          <View
            style={{
              flexDirection: isWide ? "row" : "column",
              gap: 10,
              marginTop: 10,
            }}
          >
            <AppButton
              onPress={() => {}}
              variant="secondary"
              leftIcon={
                <MaterialIcons name="visibility" size={18} color={primary} />
              }
            >
              Review Answers
            </AppButton>
            <AppButton
              onPress={() => router.replace("/(tabs)" as any)}
              variant="tertiary"
              leftIcon={
                <MaterialIcons name="school" size={18} color="#ffffff" />
              }
            >
              Back to Academy
            </AppButton>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: isWide ? "row" : "column", gap: 14 }}>
        <AppCard tone="low" style={{ flex: isWide ? 2 : undefined, gap: 12 }}>
          <AppText variant="title" colorName="primary">
            Performance Metrics
          </AppText>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View
              style={{
                flex: 1,
                borderRadius: 18,
                backgroundColor: surfaceLowest,
                padding: 14,
              }}
            >
              <AppText
                variant="labelCaps"
                colorName="secondary"
                style={{ opacity: 0.8 }}
              >
                Correct Answers
              </AppText>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "baseline",
                  gap: 6,
                  marginTop: 6,
                }}
              >
                <AppText
                  variant="headline"
                  colorName="primary"
                  style={{ fontSize: 30 }}
                >
                  {correct}
                </AppText>
                <AppText
                  variant="body"
                  colorName="secondary"
                  style={{ opacity: 0.5 }}
                >
                  / {total}
                </AppText>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                borderRadius: 18,
                backgroundColor: surfaceLowest,
                padding: 14,
              }}
            >
              <AppText
                variant="labelCaps"
                colorName="secondary"
                style={{ opacity: 0.8 }}
              >
                Time Taken
              </AppText>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "baseline",
                  gap: 6,
                  marginTop: 6,
                }}
              >
                <AppText
                  variant="headline"
                  colorName="primary"
                  style={{ fontSize: 30 }}
                >
                  {time}
                </AppText>
                <AppText
                  variant="body"
                  colorName="secondary"
                  style={{ opacity: 0.5 }}
                >
                  min
                </AppText>
              </View>
            </View>
          </View>

          <View
            style={{
              height: 10,
              borderRadius: 999,
              backgroundColor: surfaceHighest,
              overflow: "hidden",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                width: `${Math.max(0, Math.min(100, score))}%`,
                backgroundColor: primary,
              }}
            />
            <View style={{ flex: 1, backgroundColor: `${error}33` }} />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <AppText
              variant="labelCaps"
              colorName="secondary"
              style={{ opacity: 0.7 }}
            >
              Accuracy: {score}%
            </AppText>
            <AppText
              variant="labelCaps"
              colorName="secondary"
              style={{ opacity: 0.7 }}
            >
              Target: 75%
            </AppText>
          </View>
        </AppCard>

        <View style={{ flex: isWide ? 1 : undefined }}>
          <View
            style={{
              borderRadius: 28,
              padding: 18,
              backgroundColor: tertiaryContainer,
              overflow: "hidden",
              minHeight: 180,
              justifyContent: "space-between",
            }}
          >
            <View>
              <AppText variant="title" style={{ color: onTertiaryContainer }}>
                Global Rank
              </AppText>
              <AppText
                variant="body"
                style={{
                  color: onTertiaryContainer,
                  opacity: 0.8,
                  marginTop: 6,
                }}
              >
                You performed better than 94% of engineering students this week.
              </AppText>
            </View>
            <AppText
              variant="display"
              style={{
                color: onTertiaryContainer,
                fontSize: 46,
                lineHeight: 50,
              }}
            >
              Top 5%
            </AppText>
          </View>
        </View>
      </View>

      <View style={{ gap: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginLeft: 2,
          }}
        >
          <MaterialIcons name="psychology" size={22} color={primary} />
          <AppText variant="headline" style={{ fontSize: 22 }}>
            Technical Feedback
          </AppText>
        </View>

        <AppCard tone="lowest" style={{ flexDirection: "row", gap: 14 }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 18,
              backgroundColor: `${primary}14`,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons name="check-circle" size={22} color={primary} />
          </View>
          <View style={{ flex: 1, gap: 6 }}>
            <AppText variant="title" colorName="primary">
              Mastery in Data Structures
            </AppText>
            <AppText
              variant="body"
              colorName="secondary"
              style={{ fontSize: 13, opacity: 0.9 }}
            >
              Your implementation logic for Linked Lists and Binary Trees is
              flawless. You correctly identified complexity across traversal
              scenarios.
            </AppText>
          </View>
        </AppCard>

        <AppCard tone="low" style={{ flexDirection: "row", gap: 14 }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 18,
              backgroundColor: `${secondary}14`,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons name="lightbulb" size={22} color={secondary} />
          </View>
          <View style={{ flex: 1, gap: 10 }}>
            <View style={{ gap: 6 }}>
              <AppText variant="title" colorName="tertiary">
                Recommendation: Recursive Complexity
              </AppText>
              <AppText
                variant="body"
                colorName="secondary"
                style={{ fontSize: 13, opacity: 0.9 }}
              >
                While your logic is sound, we noticed a minor struggle with Big
                O notation for recursive functions. Reviewing the Master Theorem
                could help.
              </AppText>
            </View>
            <CodeBlock>{`T(n) = aT(n/b) + f(n)\n\nUse the Master Theorem to compare:\n  n^(log_b a)  vs  f(n)`}</CodeBlock>
          </View>
        </AppCard>
      </View>
    </AppScreen>
  );
}
