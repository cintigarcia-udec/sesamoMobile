import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, View, useWindowDimensions } from "react-native";

import { AdminShell } from "@/components/admin/admin-shell";
import { AppButton } from "@/components/design/app-button";
import { AppCard } from "@/components/design/app-card";
import { AppInput } from "@/components/design/app-input";
import { AppText } from "@/components/design/app-text";
import {
  ApiError,
  api,
  type Category,
  type Questionnaire,
} from "@/constants/api";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function AdminQuestionnaireEditorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();

  const primary = useThemeColor({}, "primary");
  const secondary = useThemeColor({}, "secondary");
  const surfaceHighest = useThemeColor({}, "surfaceContainerHighest");

  const questionnaireId = useMemo(() => {
    const raw = Array.isArray(id) ? id[0] : id;
    const num = typeof raw === "string" ? Number(raw) : NaN;
    return Number.isFinite(num) ? num : null;
  }, [id]);

  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(
    null,
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [questionnaireNumber, setQuestionnaireNumber] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setIsLoading(true);
      setError("");
      try {
        if (!questionnaireId) {
          setError("Id inválido.");
          return;
        }
        const [q, cats] = await Promise.all([
          api.questionnaires.get(questionnaireId),
          api.categories.list({ skip: 0, limit: 500 }),
        ]);
        if (cancelled) return;
        setQuestionnaire(q);
        setCategories(cats);
        setQuestionnaireNumber(String(q.questionnaire_number));
        setCategoryId(String(q.category_id));
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

  const isWide = width >= 900;

  const categoryLabel = useMemo(() => {
    const cat = Number(categoryId);
    if (!Number.isFinite(cat)) return "";
    return categories.find((c) => c.id === cat)?.name ?? "";
  }, [categoryId, categories]);

  const save = async () => {
    if (isSaving) return;
    const num = Number(questionnaireNumber.trim());
    const cat = Number(categoryId.trim());
    if (!questionnaireId) return;
    if (!Number.isFinite(num) || num <= 0) {
      setError("questionnaire_number debe ser un entero positivo.");
      return;
    }
    if (!Number.isFinite(cat) || cat <= 0) {
      setError("category_id debe ser un entero positivo.");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      const updated = await api.questionnaires.update(questionnaireId, {
        questionnaire_number: num,
        category_id: cat,
      });
      setQuestionnaire(updated);
      setQuestionnaireNumber(String(updated.questionnaire_number));
      setCategoryId(String(updated.category_id));
      router.back();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminShell
      active="questionnaires"
      title="Consola Admin"
      right={
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View
            style={{
              display: width >= 520 ? "flex" : "none",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: surfaceHighest,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                backgroundColor: primary,
              }}
            />
            <AppText
              variant="label"
              colorName="secondary"
              style={{ opacity: 0.9 }}
            >
              Editor en vivo
            </AppText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notificaciones"
            onPress={() => {}}
            style={({ pressed }) => [
              {
                width: 40,
                height: 40,
                borderRadius: 999,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: pressed ? surfaceHighest : "transparent",
              },
            ]}
          >
            <MaterialIcons name="notifications" size={22} color={primary} />
          </Pressable>
        </View>
      }
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          marginBottom: 10,
        }}
      >
        <AppText
          variant="label"
          colorName="secondary"
          style={{ opacity: 0.85 }}
        >
          Cuestionarios
        </AppText>
        <MaterialIcons name="chevron-right" size={18} color={secondary} />
        <AppText
          variant="label"
          colorName="primary"
          style={{ fontWeight: "700" }}
        >
          Editor de Cuestionario
        </AppText>
      </View>

      <View
        style={{
          flexDirection: isWide ? "row" : "column",
          alignItems: isWide ? "flex-end" : "flex-start",
          justifyContent: "space-between",
          gap: 14,
        }}
      >
        <View style={{ flex: 1, gap: 8 }}>
          <AppText
            variant="headline"
            colorName="primary"
            style={{
              fontSize: width >= 900 ? 52 : 38,
              lineHeight: width >= 900 ? 56 : 44,
            }}
          >
            {isLoading
              ? "Cargando..."
              : questionnaire
                ? `Cuestionario #${questionnaire.questionnaire_number}`
                : "Cuestionario"}
          </AppText>
          <AppText
            variant="body"
            colorName="secondary"
            style={{ opacity: 0.9, maxWidth: 760 }}
          >
            {error
              ? error
              : categoryLabel
                ? `Categoría: ${categoryLabel}`
                : categoryId
                  ? `category_id: ${categoryId}`
                  : ""}
          </AppText>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <AppButton
            variant="tertiary"
            onPress={() => router.back()}
            leftIcon={<MaterialIcons name="close" size={18} color={primary} />}
          >
            Cancelar
          </AppButton>
          <AppButton
            onPress={save}
            leftIcon={
              <MaterialIcons name="publish" size={18} color="#ffffff" />
            }
          >
            {isSaving ? "Guardando..." : "Guardar"}
          </AppButton>
        </View>
      </View>

      <View
        style={{
          flexDirection: isWide ? "row" : "column",
          gap: 14,
          marginTop: 16,
        }}
      >
        <AppCard
          tone="low"
          style={{ flex: isWide ? 5 : undefined, borderRadius: 18, gap: 12 }}
        >
          <AppText variant="title">Metadatos</AppText>
          <View style={{ gap: 10 }}>
            <AppText
              variant="labelCaps"
              colorName="secondary"
              style={{ opacity: 0.75 }}
            >
              questionnaire_number
            </AppText>
            <AppInput
              value={questionnaireNumber}
              onChangeText={setQuestionnaireNumber}
              accessibilityLabel="questionnaire_number"
              keyboardType="numeric"
            />
          </View>
          <View style={{ gap: 10 }}>
            <AppText
              variant="labelCaps"
              colorName="secondary"
              style={{ opacity: 0.75 }}
            >
              category_id
            </AppText>
            <AppInput
              value={categoryId}
              onChangeText={setCategoryId}
              accessibilityLabel="category_id"
              keyboardType="numeric"
            />
            {categoryLabel ? (
              <AppText
                variant="label"
                colorName="secondary"
                style={{ opacity: 0.85 }}
              >
                Categoría: {categoryLabel}
              </AppText>
            ) : null}
          </View>
        </AppCard>
      </View>
    </AdminShell>
  );
}
