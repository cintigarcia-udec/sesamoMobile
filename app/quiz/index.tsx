import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { AppButton } from "@/components/design/app-button";
import { AppCard } from "@/components/design/app-card";
import { AppScreen } from "@/components/design/app-screen";
import { AppText } from "@/components/design/app-text";
import { TopAppBar } from "@/components/design/top-app-bar";
import { ApiError, api, type Category, type Questionnaire } from "@/constants/api";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function QuizDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const primary = useThemeColor({}, "primary");
  const secondary = useThemeColor({}, "secondary");

  const questionnaireId = useMemo(() => {
    const raw = Array.isArray(id) ? id[0] : id;
    const num = typeof raw === "string" ? Number(raw) : NaN;
    return Number.isFinite(num) ? num : null;
  }, [id]);

  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setIsLoading(true);
      setError("");
      try {
        if (!questionnaireId) {
          setError("Id de cuestionario inválido.");
          return;
        }
        const [q, cats] = await Promise.all([
          api.questionnaires.get(questionnaireId),
          api.categories.list({ skip: 0, limit: 200 }),
        ]);
        if (cancelled) return;
        setQuestionnaire(q);
        setCategories(cats);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof ApiError
            ? err.message
            : "No se pudo cargar el cuestionario.",
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [questionnaireId]);

  const categoryName = useMemo(() => {
    const categoryId = questionnaire?.category_id;
    if (!categoryId) return "";
    return (
      questionnaire?.category_name ??
      categories.find((c) => c.id === categoryId)?.name ??
      ""
    );
  }, [questionnaire, categories]);

  const title = questionnaire
    ? `Cuestionario #${questionnaire.questionnaire_number}`
    : "Detalle del Cuestionario";
  const description = categoryName ? `Categoría: ${categoryName}` : "";
  const duration = "—";
  const questionsCount = "—";

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
        left={
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={primary}
            onPress={() => router.back()}
          />
        }
      />

      <View style={{ gap: 12, marginTop: 16 }}>
        <AppText variant="display" colorName="primary">
          {title}
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
        ) : description ? (
          <AppText variant="body" colorName="secondary">
            {description}
          </AppText>
        ) : null}
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
          onPress={() =>
            questionnaireId
              ? router.push(`/quiz/questions?quizId=${questionnaireId}` as any)
              : undefined
          }
          accessibilityLabel="Comenzar Cuestionario"
          rightIcon={<MaterialIcons name="play-arrow" size={20} color="#fff" />}
        >
          Comenzar Intento
        </AppButton>
      </View>
    </AppScreen>
  );
}
