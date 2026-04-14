import { useRouter, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { AppButton } from "@/components/design/app-button";
import { AppCard } from "@/components/design/app-card";
import { AppScreen } from "@/components/design/app-screen";
import { AppText } from "@/components/design/app-text";
import { TopAppBar } from "@/components/design/top-app-bar";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function QuizDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const primary = useThemeColor({}, "primary");
  const secondary = useThemeColor({}, "secondary");

  // Mock fetch based on ID
  const title = id === "q-1" ? "Algorithms & Complexity" : "Discrete Mathematics";
  const description = "Test your knowledge on Big O notation and sorting algorithms. This quiz consists of 10 questions designed to challenge your understanding of time and space complexity.";
  const duration = id === "q-1" ? "15 min" : "20 min";
  const questionsCount = 10;

  return (
    <AppScreen
      scroll
      contentContainerStyle={{
        paddingTop: 92,
        paddingHorizontal: 20,
        maxWidth: 720,
        width: "100%",
        alignSelf: "center",
        gap: 24,
      }}
    >
      <TopAppBar
        title="Detalle del Cuestionario"
        left={<MaterialIcons name="arrow-back" size={24} color={primary} onPress={() => router.back()} />}
      />

      <View style={{ gap: 12, marginTop: 16 }}>
        <AppText variant="display" colorName="primary">
          {title}
        </AppText>
        <AppText variant="body" colorName="secondary">
          {description}
        </AppText>
      </View>

      <AppCard tone="low" style={{ gap: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <MaterialIcons name="timer" size={24} color={secondary} />
          <AppText variant="bodyStrong">Duración estimada: {duration}</AppText>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <MaterialIcons name="format-list-numbered" size={24} color={secondary} />
          <AppText variant="bodyStrong">Preguntas: {questionsCount}</AppText>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <MaterialIcons name="military-tech" size={24} color={secondary} />
          <AppText variant="bodyStrong">Dificultad: Intermedia</AppText>
        </View>
      </AppCard>

      <View style={{ marginTop: 24 }}>
        <AppButton 
          onPress={() => router.push(`/quiz/questions?quizId=${id}` as any)}
          accessibilityLabel="Comenzar Cuestionario"
          rightIcon={<MaterialIcons name="play-arrow" size={20} color="#fff" />}
        >
          Comenzar Intento
        </AppButton>
      </View>
    </AppScreen>
  );
}
