import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, View, useWindowDimensions } from "react-native";

import { AdminShell } from "@/components/admin/admin-shell";
import { AppButton } from "@/components/design/app-button";
import { AppCard } from "@/components/design/app-card";
import { AppInput } from "@/components/design/app-input";
import { AppText } from "@/components/design/app-text";
import { useThemeColor } from "@/hooks/use-theme-color";

type Questionnaire = {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  status: "Active" | "Draft" | "Archived";
  questions: number;
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

  const formatStatus = (status: Questionnaire["status"]) =>
    status === "Active"
      ? "Activo"
      : status === "Draft"
        ? "Borrador"
        : "Archivado";

  const data = useMemo<Questionnaire[]>(
    () => [
      {
        id: "logic-boolean",
        title: "Lógica Booleana",
        subtitle: "Validación de operadores y equivalencias",
        tags: ["logic", "foundation"],
        status: "Active",
        questions: 24,
      },
      {
        id: "ds-algo",
        title: "Data Structures & Algorithms",
        subtitle: "Complejidad y análisis",
        tags: ["algorithms", "complexity"],
        status: "Active",
        questions: 32,
      },
      {
        id: "oop",
        title: "OOP Patterns",
        subtitle: "Arquitectura orientada a objetos",
        tags: ["design", "patterns"],
        status: "Draft",
        questions: 18,
      },
    ],
    [],
  );

  const filtered = data.filter((q) => {
    const hay = `${q.title} ${q.subtitle} ${q.tags.join(" ")}`.toLowerCase();
    return hay.includes(query.trim().toLowerCase());
  });

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
            placeholder="Filtrar por título o etiqueta..."
            accessibilityLabel="Filtrar por título o tag"
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
              onPress={() =>
                router.push("/admin/questionnaires/ds-algo/edit" as any)
              }
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
                  128
                </AppText>
                <AppText
                  variant="labelCaps"
                  style={{ color: "#ffffff", opacity: 0.8 }}
                >
                  Total de Preguntas
                </AppText>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <AppText
                  variant="headline"
                  style={{ color: "#ffffff", fontSize: 28 }}
                >
                  14
                </AppText>
                <AppText
                  variant="labelCaps"
                  style={{ color: "#ffffff", opacity: 0.8 }}
                >
                  Módulos Activos
                </AppText>
              </View>
            </View>
          </View>
        </AppCard>
      </View>

      <View style={{ marginTop: 14, gap: 10 }}>
        {filtered.map((q) => (
          <Pressable
            key={q.id}
            accessibilityRole="button"
            accessibilityLabel={`Editar ${q.title}`}
            onPress={() =>
              router.push({
                pathname: "/admin/questionnaires/[id]/edit" as any,
                params: { id: q.id },
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
                    name="terminal"
                    size={22}
                    color={inverseOnSurface}
                  />
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <AppText variant="bodyStrong">{q.title}</AppText>
                  <AppText
                    variant="label"
                    colorName="secondary"
                    style={{ opacity: 0.85 }}
                  >
                    {q.subtitle}
                  </AppText>
                </View>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: `${primary}14`,
                  }}
                >
                  <AppText variant="labelCaps" colorName="primary">
                    {formatStatus(q.status)}
                  </AppText>
                </View>
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: `${secondary}14`,
                  }}
                >
                  <AppText variant="labelCaps" colorName="secondary">
                    {q.questions} Preg.
                  </AppText>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={22}
                  color={secondary}
                />
              </View>
            </View>
          </Pressable>
        ))}
        {filtered.length === 0 ? (
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
    </AdminShell>
  );
}
