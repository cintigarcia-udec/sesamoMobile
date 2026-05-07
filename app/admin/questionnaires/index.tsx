import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  View,
  useWindowDimensions,
} from "react-native";

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

type QuestionnaireRow = {
  id: number;
  questionnaire_number: number;
  category_id: number;
  categoryLabel: string;
};

export default function AdminQuestionnairesScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const primary = useThemeColor({}, "primary");
  const secondary = useThemeColor({}, "secondary");
  const primaryContainer = useThemeColor({}, "primaryContainer");
  const onSecondaryContainer = useThemeColor({}, "onSecondaryContainer");
  const surfaceHighest = useThemeColor({}, "surfaceContainerHighest");
  const surfaceLow = useThemeColor({}, "surfaceContainerLow");
  const surfaceLowest = useThemeColor({}, "surfaceContainerLowest");
  const inverseSurface = useThemeColor({}, "inverseSurface");
  const inverseOnSurface = useThemeColor({}, "inverseOnSurface");

  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<QuestionnaireRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [questionnaireNumber, setQuestionnaireNumber] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const load = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [qs, cats] = await Promise.all([
        api.questionnaires.list({ skip: 0, limit: 2000 }),
        api.categories.list({ skip: 0, limit: 500 }),
      ]);

      const catById = new Map<number, Category>();
      for (const c of cats) catById.set(c.id, c);

      const nextRows = qs.map<QuestionnaireRow>((q: Questionnaire) => ({
        id: q.id,
        questionnaire_number: q.questionnaire_number,
        category_id: q.category_id,
        categoryLabel:
          q.category_name ?? catById.get(q.category_id)?.name ?? "",
      }));

      setCategories(cats);
      setRows(nextRows);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudieron cargar los cuestionarios.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((it) => {
      const hay =
        `#${it.questionnaire_number} ${it.categoryLabel} ${it.category_id}`.toLowerCase();
      return hay.includes(q);
    });
  }, [rows, query]);

  const openCreate = () => {
    setFormError("");
    setQuestionnaireNumber("");
    setCategoryId("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
  };

  const create = async () => {
    if (isSaving) return;
    const num = Number(questionnaireNumber.trim());
    const cat = Number(categoryId.trim());
    if (!Number.isFinite(num) || num <= 0) {
      setFormError("questionnaire_number debe ser un entero positivo.");
      return;
    }
    if (!Number.isFinite(cat) || cat <= 0) {
      setFormError("category_id debe ser un entero positivo.");
      return;
    }
    setIsSaving(true);
    setFormError("");
    try {
      await api.questionnaires.create({
        questionnaire_number: num,
        category_id: cat,
      });
      setIsModalOpen(false);
      await load();
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.message
          : "No se pudo crear el cuestionario.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id: number) => {
    try {
      await api.questionnaires.delete(id);
      await load();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudo eliminar el cuestionario.",
      );
    }
  };

  return (
    <AdminShell
      active="questionnaires"
      title="Consola Admin"
      right={
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={{ display: width >= 520 ? "flex" : "none", width: 240 }}>
            <AppInput
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar cuestionarios..."
              accessibilityLabel="Buscar cuestionarios"
            />
          </View>
          <View
            accessibilityLabel="Perfil de administrador"
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
              AU
            </AppText>
          </View>
        </View>
      }
    >
      <View style={{ gap: 10, marginLeft: width >= 900 ? 16 : 0 }}>
        <AppText
          variant="labelCaps"
          colorName="primary"
          style={{ opacity: 0.9 }}
        >
          Centro de Gestión
        </AppText>
        <AppText
          variant="headline"
          style={{ fontSize: width >= 900 ? 48 : 36 }}
        >
          Cuestionarios
        </AppText>
        <AppText
          variant="body"
          colorName="secondary"
          style={{ opacity: 0.9, maxWidth: 760 }}
        >
          Administra tus evaluaciones. Gestiona cuestionarios, preguntas y su
          estado desde una vista centralizada.
        </AppText>
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
          tone="low"
          style={{
            width: width >= 900 ? "64%" : "100%",
            borderRadius: 14,
            gap: 10,
          }}
        >
          <AppInput
            value={query}
            onChangeText={setQuery}
            placeholder="Filtrar por número o categoría..."
            accessibilityLabel="Filtrar cuestionarios"
          />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <AppButton
              variant="secondary"
              onPress={() => {}}
              leftIcon={
                <MaterialIcons
                  name="filter-list"
                  size={18}
                  color={onSecondaryContainer}
                />
              }
            >
              Filtrar
            </AppButton>
            <AppButton
              variant="tertiary"
              onPress={openCreate}
              leftIcon={<MaterialIcons name="add" size={18} color={primary} />}
            >
              Nuevo
            </AppButton>
          </View>
        </AppCard>

        <AppCard
          tone="lowest"
          style={{
            width: width >= 900 ? "34%" : "100%",
            borderRadius: 14,
            padding: 0,
            overflow: "hidden",
          }}
        >
          <View style={{ padding: 18, backgroundColor: primary }}>
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: primaryContainer,
                opacity: 0.25,
              }}
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View>
                <AppText
                  variant="headline"
                  style={{ color: "#ffffff", fontSize: 28 }}
                >
                  {rows.length}
                </AppText>
                <AppText
                  variant="labelCaps"
                  style={{ color: "#ffffff", opacity: 0.8 }}
                >
                  Total de Cuestionarios
                </AppText>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <AppText
                  variant="headline"
                  style={{ color: "#ffffff", fontSize: 28 }}
                >
                  {categories.length}
                </AppText>
                <AppText
                  variant="labelCaps"
                  style={{ color: "#ffffff", opacity: 0.8 }}
                >
                  Categorías
                </AppText>
              </View>
            </View>
          </View>
        </AppCard>
      </View>

      <View style={{ marginTop: 14, gap: 10 }}>
        {isLoading ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <ActivityIndicator color={primary} />
            <AppText variant="body" colorName="secondary">
              Cargando...
            </AppText>
          </View>
        ) : error ? (
          <AppCard tone="low">
            <AppText variant="bodyStrong">Error</AppText>
            <AppText
              variant="label"
              colorName="secondary"
              style={{ opacity: 0.85, marginTop: 6 }}
            >
              {error}
            </AppText>
          </AppCard>
        ) : (
          filtered.map((q) => (
            <Pressable
              key={q.id}
              accessibilityRole="button"
              accessibilityLabel={`Editar Cuestionario #${q.questionnaire_number}`}
              onPress={() =>
                router.push({
                  pathname: "/admin/questionnaires/[id]/edit" as any,
                  params: { id: String(q.id) },
                })
              }
              style={({ pressed }) => [
                {
                  borderRadius: 14,
                  padding: 16,
                  backgroundColor: pressed ? surfaceLow : surfaceLowest,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: width >= 720 ? "row" : "column",
                  alignItems: width >= 720 ? "center" : "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 14,
                      backgroundColor: inverseSurface,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialIcons
                      name="quiz"
                      size={22}
                      color={inverseOnSurface}
                    />
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <AppText variant="bodyStrong">
                      Cuestionario #{q.questionnaire_number}
                    </AppText>
                    <AppText
                      variant="label"
                      colorName="secondary"
                      style={{ opacity: 0.85 }}
                    >
                      {q.categoryLabel
                        ? `Categoría: ${q.categoryLabel}`
                        : `category_id: ${q.category_id}`}
                    </AppText>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 999,
                      backgroundColor: `${secondary}14`,
                    }}
                  >
                    <AppText variant="labelCaps" colorName="secondary">
                      ID {q.id}
                    </AppText>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Eliminar cuestionario ${q.id}`}
                    onPress={(e) => {
                      (e as any)?.stopPropagation?.();
                      remove(q.id);
                    }}
                    style={({ pressed }) => [
                      {
                        width: 40,
                        height: 40,
                        borderRadius: 999,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: pressed
                          ? surfaceHighest
                          : "transparent",
                      },
                    ]}
                  >
                    <MaterialIcons name="delete" size={20} color={secondary} />
                  </Pressable>
                  <MaterialIcons
                    name="chevron-right"
                    size={22}
                    color={secondary}
                  />
                </View>
              </View>
            </Pressable>
          ))
        )}
        {!isLoading && !error && filtered.length === 0 ? (
          <AppCard tone="low">
            <AppText variant="bodyStrong">Sin resultados</AppText>
            <AppText
              variant="label"
              colorName="secondary"
              style={{ opacity: 0.85, marginTop: 6 }}
            >
              Ajusta los filtros o el texto de búsqueda.
            </AppText>
          </AppCard>
        ) : null}
      </View>

      <Modal
        visible={isModalOpen}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Pressable
          onPress={closeModal}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.45)",
            padding: 18,
            justifyContent: "center",
          }}
        >
          <Pressable
            onPress={() => {}}
            style={{ width: "100%", maxWidth: 620, alignSelf: "center" }}
          >
            <AppCard tone="lowest" style={{ gap: 12 }}>
              <AppText variant="title" colorName="primary">
                Crear cuestionario
              </AppText>
              <View style={{ gap: 10 }}>
                <AppText
                  variant="labelCaps"
                  colorName="secondary"
                  style={{ opacity: 0.8 }}
                >
                  questionnaire_number
                </AppText>
                <AppInput
                  value={questionnaireNumber}
                  onChangeText={setQuestionnaireNumber}
                  placeholder="Ej: 1"
                  keyboardType="numeric"
                />
              </View>
              <View style={{ gap: 10 }}>
                <AppText
                  variant="labelCaps"
                  colorName="secondary"
                  style={{ opacity: 0.8 }}
                >
                  category_id
                </AppText>
                <AppInput
                  value={categoryId}
                  onChangeText={setCategoryId}
                  placeholder="Ej: 2"
                  keyboardType="numeric"
                />
              </View>
              {formError ? (
                <AppText variant="labelCaps" colorName="error">
                  {formError}
                </AppText>
              ) : null}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  gap: 10,
                }}
              >
                <AppButton variant="tertiary" onPress={closeModal}>
                  Cancelar
                </AppButton>
                <AppButton onPress={create}>
                  {isSaving ? "Creando..." : "Crear"}
                </AppButton>
              </View>
            </AppCard>
          </Pressable>
        </Pressable>
      </Modal>
    </AdminShell>
  );
}
