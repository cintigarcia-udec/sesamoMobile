import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, View, useWindowDimensions } from "react-native";

import { AdminShell } from "@/components/admin/admin-shell";
import { AppButton } from "@/components/design/app-button";
import { AppCard } from "@/components/design/app-card";
import { AppInput } from "@/components/design/app-input";
import { AppText } from "@/components/design/app-text";
import { CodeBlock } from "@/components/design/code-block";
import { useThemeColor } from "@/hooks/use-theme-color";

type EditableQuestion = {
  id: string;
  prompt: string;
  code?: string;
  answer: string;
};

export default function AdminQuestionnaireEditorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();

  const primary = useThemeColor({}, "primary");
  const secondary = useThemeColor({}, "secondary");
  const surfaceHighest = useThemeColor({}, "surfaceContainerHighest");
  const surfaceLow = useThemeColor({}, "surfaceContainerLow");
  const onSecondaryContainer = useThemeColor({}, "onSecondaryContainer");

  const [title, setTitle] = useState(
    id === "ds-algo" ? "Estructuras de Datos y Algoritmos" : "Cuestionario",
  );
  const [description, setDescription] = useState(
    "Evaluación avanzada para estudiantes de ingeniería enfocada en análisis de complejidad.",
  );

  const [questions, setQuestions] = useState<EditableQuestion[]>(
    useMemo(
      () => [
        {
          id: "q1",
          prompt:
            "¿Cuál es la complejidad temporal de insertar en un árbol binario de búsqueda balanceado (BST)?",
          code: "insert(node, value) => recorrer altura h, luego rotar/rebalancear",
          answer: "O(log n)",
        },
        {
          id: "q2",
          prompt:
            "¿Qué estructura de datos es la más adecuada para implementar una caché LRU?",
          answer: "Mapa hash + lista doblemente enlazada",
        },
      ],
      [],
    ),
  );

  const isWide = width >= 900;

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
            {title}
          </AppText>
          <AppText
            variant="body"
            colorName="secondary"
            style={{ opacity: 0.9, maxWidth: 760 }}
          >
            {description}
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
            onPress={() => {}}
            leftIcon={
              <MaterialIcons name="publish" size={18} color="#ffffff" />
            }
          >
            Publicar
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
              Título
            </AppText>
            <AppInput
              value={title}
              onChangeText={setTitle}
              accessibilityLabel="Título del cuestionario"
            />
          </View>
          <View style={{ gap: 10 }}>
            <AppText
              variant="labelCaps"
              colorName="secondary"
              style={{ opacity: 0.75 }}
            >
              Descripción
            </AppText>
            <AppInput
              value={description}
              onChangeText={setDescription}
              accessibilityLabel="Descripción del cuestionario"
              multiline
            />
          </View>
        </AppCard>

        <AppCard
          tone="lowest"
          style={{ flex: isWide ? 7 : undefined, borderRadius: 18, gap: 12 }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <AppText variant="title">Estructura de Preguntas</AppText>
            <AppButton
              variant="secondary"
              onPress={() =>
                setQuestions((prev) => [
                  ...prev,
                  {
                    id: `q${prev.length + 1}`,
                    prompt: "Nuevo enunciado de pregunta",
                    answer: "",
                  },
                ])
              }
              leftIcon={
                <MaterialIcons
                  name="add"
                  size={18}
                  color={onSecondaryContainer}
                />
              }
            >
              Agregar Pregunta
            </AppButton>
          </View>

          <View style={{ gap: 12 }}>
            {questions.map((q) => (
              <View
                key={q.id}
                style={{
                  borderRadius: 18,
                  padding: 14,
                  backgroundColor: surfaceLow,
                  gap: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <AppText
                    variant="labelCaps"
                    colorName="secondary"
                    style={{ opacity: 0.8 }}
                  >
                    {q.id.toUpperCase()}
                  </AppText>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Eliminar ${q.id}`}
                    onPress={() =>
                      setQuestions((prev) => prev.filter((x) => x.id !== q.id))
                    }
                    style={({ pressed }) => [
                      {
                        padding: 8,
                        borderRadius: 999,
                        backgroundColor: pressed
                          ? surfaceHighest
                          : "transparent",
                      },
                    ]}
                  >
                    <MaterialIcons name="delete" size={18} color={secondary} />
                  </Pressable>
                </View>

                <AppInput
                  value={q.prompt}
                  onChangeText={(t) =>
                    setQuestions((prev) =>
                      prev.map((x) =>
                        x.id === q.id ? { ...x, prompt: t } : x,
                      ),
                    )
                  }
                  accessibilityLabel={`Enunciado ${q.id}`}
                  placeholder="Enunciado de la pregunta"
                />

                {q.code ? <CodeBlock>{q.code}</CodeBlock> : null}

                <AppInput
                  value={q.answer}
                  onChangeText={(t) =>
                    setQuestions((prev) =>
                      prev.map((x) =>
                        x.id === q.id ? { ...x, answer: t } : x,
                      ),
                    )
                  }
                  accessibilityLabel={`Respuesta ${q.id}`}
                  placeholder="Respuesta esperada"
                />
              </View>
            ))}
          </View>
        </AppCard>
      </View>
    </AdminShell>
  );
}
