import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";

import { AppButton } from "@/components/design/app-button";
import { AppCard } from "@/components/design/app-card";
import { AppScreen } from "@/components/design/app-screen";
import { AppText } from "@/components/design/app-text";
import { CodeBlock } from "@/components/design/code-block";
import { TopAppBar } from "@/components/design/top-app-bar";
import { useThemeColor } from "@/hooks/use-theme-color";

type Question = {
  id: string;
  title: string;
  contextLabel: string;
  code: string;
  options: {
    key: string;
    title: string;
    subtitle: string;
    correct?: boolean;
  }[];
};

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function QuizQuestionsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const primary = useThemeColor({}, "primary");
  const primaryContainer = useThemeColor({}, "primaryContainer");
  const secondary = useThemeColor({}, "secondary");
  const surfaceHighest = useThemeColor({}, "surfaceContainerHighest");
  const surfaceLowest = useThemeColor({}, "surfaceContainerLowest");
  const outlineVariant = useThemeColor({}, "outlineVariant");

  const mockQuestions = useMemo<Question[]>(
    () => [
      {
        id: "bst-search",
        title:
          "What is the average-case time complexity for searching an element in a balanced binary search tree (BST)?",
        contextLabel: "Technical Context",
        code: `function search(node, target) {\n  if (!node) return null;\n  if (node.val === target) return node;\n  return target < node.val\n    ? search(node.left, target)\n    : search(node.right, target);\n}`,
        options: [
          { key: "A", title: "O(1)", subtitle: "Constant Time" },
          {
            key: "B",
            title: "O(log n)",
            subtitle: "Logarithmic Time",
            correct: true,
          },
          { key: "C", title: "O(n)", subtitle: "Linear Time" },
          { key: "D", title: "O(n log n)", subtitle: "Linearithmic Time" },
        ],
      },
      {
        id: "hash-lookup",
        title:
          "In a well-implemented hash table, what is the expected time complexity for a successful lookup?",
        contextLabel: "Technical Context",
        code: `const index = hash(key) % buckets.length;\nfor (const entry of buckets[index]) {\n  if (entry.key === key) return entry.value;\n}\nreturn null;`,
        options: [
          {
            key: "A",
            title: "O(1)",
            subtitle: "Amortized Constant",
            correct: true,
          },
          { key: "B", title: "O(log n)", subtitle: "Logarithmic" },
          { key: "C", title: "O(n)", subtitle: "Worst-case" },
          { key: "D", title: "O(n log n)", subtitle: "Sorting bound" },
        ],
      },
    ],
    [],
  );

  const questions = mockQuestions;
  const total = questions.length;
  const [index, setIndex] = useState(0);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);

  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setIsLoadingQuestions(false), 600);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (isLoadingQuestions) return;
    setIsLoadingOptions(true);
    const id = setTimeout(() => setIsLoadingOptions(false), 450);
    return () => clearTimeout(id);
  }, [index, isLoadingQuestions]);

  const q = questions[index] ?? questions[0]!;
  const progress = (index + 1) / total;

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) {
      router.replace({
        pathname: "/quiz/results" as any,
        params: {
          score: String(Math.round((correctCount / total) * 100)),
          correct: String(correctCount),
          total: String(total),
          time: formatTime(15 * 60),
        },
      });
    }
  }, [secondsLeft, correctCount, total, router]);

  const isWide = width >= 900;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = () => {
    if (!selectedKey || isSubmitting || isLoadingQuestions || isLoadingOptions)
      return;
    setIsSubmitting(true);

    setTimeout(() => {
      const isCorrect =
        q.options.find((o) => o.key === selectedKey)?.correct === true;
      const nextCorrectCount = correctCount + (isCorrect ? 1 : 0);
      setCorrectCount(nextCorrectCount);
      setSelectedKey(null);
      setIsSubmitting(false);

      if (index + 1 >= total) {
        const score = Math.round((nextCorrectCount / total) * 100);
        router.replace({
          pathname: "/quiz/results" as any,
          params: {
            score: String(score),
            correct: String(nextCorrectCount),
            total: String(total),
            time: formatTime(15 * 60 - secondsLeft),
          },
        });
        return;
      }

      setIndex((i) => i + 1);
    }, 800);
  };

  const isLastQuestion = index + 1 >= total;
  const canInteract = !isLoadingQuestions && !isLoadingOptions && !isSubmitting;

  return (
    <AppScreen scroll={false} style={{ paddingTop: 0 }}>
      <TopAppBar
        title={undefined}
        left={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cerrar evaluación"
            onPress={() => router.back()}
            style={({ pressed }) => [
              {
                padding: 8,
                borderRadius: 999,
                backgroundColor: pressed
                  ? `${surfaceHighest}cc`
                  : "transparent",
              },
            ]}
          >
            <MaterialIcons name="close" size={22} color={secondary} />
          </Pressable>
        }
        right={
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                backgroundColor: surfaceHighest,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 12,
              }}
            >
              <MaterialIcons name="timer" size={18} color={primary} />
              <AppText
                variant="bodyStrong"
                colorName="onSurface"
                style={{ fontVariant: ["tabular-nums"] }}
              >
                {formatTime(secondsLeft)}
              </AppText>
            </View>
            <View
              accessibilityLabel="Perfil"
              style={{
                width: 38,
                height: 38,
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
          </View>
        }
      />

      <View style={{ flex: 1, paddingTop: 92 }}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 130,
            maxWidth: 980,
            width: "100%",
            alignSelf: "center",
          }}
        >
          <View style={{ marginBottom: 14, gap: 12 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <View style={{ gap: 4 }}>
                <AppText
                  variant="labelCaps"
                  colorName="secondary"
                  style={{ opacity: 0.8 }}
                >
                  Assessment Progress
                </AppText>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "baseline",
                    gap: 10,
                  }}
                >
                  <AppText
                    variant="headline"
                    colorName="primary"
                    style={{ fontSize: 52, lineHeight: 56 }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </AppText>
                  <AppText
                    variant="headline"
                    colorName="outlineVariant"
                    style={{ fontSize: 22 }}
                  >
                    / {total}
                  </AppText>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  maxWidth: 360,
                  height: 6,
                  borderRadius: 999,
                  backgroundColor: surfaceHighest,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: `${Math.round(progress * 100)}%`,
                    height: "100%",
                    borderRadius: 999,
                    backgroundColor: primary,
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: primaryContainer,
                    opacity: 0.25,
                  }}
                />
              </View>
            </View>
          </View>

          {isLoadingQuestions ? (
            <AppCard tone="low" style={{ padding: 22, gap: 12 }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <ActivityIndicator color={primary} />
                <View style={{ flex: 1, gap: 4 }}>
                  <AppText variant="bodyStrong">Cargando preguntas</AppText>
                  <AppText
                    variant="label"
                    colorName="secondary"
                    style={{ opacity: 0.85 }}
                  >
                    Preparando el cuestionario...
                  </AppText>
                </View>
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
                  style={{
                    width: "42%",
                    height: "100%",
                    backgroundColor: primary,
                    opacity: 0.8,
                  }}
                />
              </View>
            </AppCard>
          ) : (
            <View style={{ flexDirection: isWide ? "row" : "column", gap: 16 }}>
              <View style={{ flex: isWide ? 7 : undefined, gap: 12 }}>
                <AppCard tone="low" style={{ padding: 22, gap: 14 }}>
                  <View style={{ gap: 6 }}>
                    <AppText
                      variant="labelCaps"
                      colorName="secondary"
                      style={{ opacity: 0.8 }}
                    >
                      Pregunta
                    </AppText>
                    <AppText
                      variant="headline"
                      colorName="onSurface"
                      style={{ fontSize: 24, lineHeight: 30 }}
                    >
                      {q.title}
                    </AppText>
                  </View>
                  <View style={{ gap: 10 }}>
                    <AppText
                      variant="labelCaps"
                      colorName="secondary"
                      style={{ opacity: 0.8 }}
                    >
                      {q.contextLabel}
                    </AppText>
                    <CodeBlock>{q.code}</CodeBlock>
                  </View>
                </AppCard>
              </View>

              <View style={{ flex: isWide ? 5 : undefined, gap: 10 }}>
                <View style={{ gap: 4, paddingHorizontal: 6 }}>
                  <AppText
                    variant="labelCaps"
                    colorName="secondary"
                    style={{ opacity: 0.8 }}
                  >
                    Opciones
                  </AppText>
                  <AppText
                    variant="label"
                    colorName="secondary"
                    style={{ opacity: 0.75 }}
                  >
                    Selecciona una opción. Las opciones se cargan por pregunta.
                  </AppText>
                </View>

                {isLoadingOptions ? (
                  <AppCard
                    tone="low"
                    style={{
                      padding: 16,
                      borderRadius: 18,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <ActivityIndicator color={primary} />
                    <View style={{ flex: 1 }}>
                      <AppText variant="bodyStrong">Cargando opciones</AppText>
                      <AppText
                        variant="label"
                        colorName="secondary"
                        style={{ opacity: 0.85 }}
                      >
                        Preparando opciones de respuesta...
                      </AppText>
                    </View>
                  </AppCard>
                ) : (
                  q.options.map((opt) => {
                    const selected = opt.key === selectedKey;
                    return (
                      <Pressable
                        key={opt.key}
                        accessibilityRole="button"
                        accessibilityLabel={`Opción ${opt.key}: ${opt.title}`}
                        disabled={!canInteract}
                        onPress={() => setSelectedKey(opt.key)}
                        style={({ pressed }) => [
                          {
                            borderRadius: 18,
                            padding: 16,
                            backgroundColor: selected
                              ? surfaceLowest
                              : surfaceHighest,
                            transform: [{ scale: pressed ? 0.99 : 1 }],
                            borderWidth: selected ? 2 : 1,
                            borderColor: selected
                              ? primary
                              : `${outlineVariant}33`,
                            opacity: !canInteract ? 0.6 : 1,
                          },
                        ]}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 14,
                          }}
                        >
                          <View
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 12,
                              backgroundColor: selected
                                ? primary
                                : surfaceLowest,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <AppText
                              variant="bodyStrong"
                              style={{ color: selected ? "#ffffff" : primary }}
                            >
                              {opt.key}
                            </AppText>
                          </View>
                          <View style={{ flex: 1, gap: 2 }}>
                            <AppText
                              variant="title"
                              style={{
                                fontSize: 18,
                                color: selected ? primary : undefined,
                              }}
                            >
                              {opt.title}
                            </AppText>
                            <AppText
                              variant="label"
                              colorName={selected ? "primary" : "secondary"}
                              style={{ opacity: selected ? 0.75 : 0.8 }}
                            >
                              {opt.subtitle}
                            </AppText>
                          </View>
                          {selected ? (
                            <MaterialIcons
                              name="check-circle"
                              size={20}
                              color={primary}
                            />
                          ) : null}
                        </View>
                      </Pressable>
                    );
                  })
                )}

                {isLastQuestion ? (
                  <AppCard
                    tone="lowest"
                    style={{
                      marginTop: 12,
                      padding: 16,
                      borderRadius: 18,
                      gap: 8,
                    }}
                  >
                    <AppText
                      variant="labelCaps"
                      colorName="secondary"
                      style={{ opacity: 0.8 }}
                    >
                      Enviar respuestas
                    </AppText>
                    <AppText
                      variant="label"
                      colorName="secondary"
                      style={{ opacity: 0.85 }}
                    >
                      Al finalizar guardaremos tu intento y verás tu resultado.
                    </AppText>
                  </AppCard>
                ) : null}
              </View>
            </View>
          )}
        </ScrollView>

        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            paddingHorizontal: 20,
            paddingTop: 14,
            paddingBottom: 18,
            borderTopWidth: 1,
            borderTopColor: `${outlineVariant}33`,
            backgroundColor: surfaceHighest,
          }}
        >
          <View
            style={{
              maxWidth: 980,
              width: "100%",
              alignSelf: "center",
              gap: 8,
            }}
          >
            <AppText
              variant="label"
              colorName="secondary"
              style={{ opacity: 0.8 }}
            >
              {isLoadingQuestions
                ? "Cargando preguntas…"
                : isLoadingOptions
                  ? "Cargando opciones…"
                  : isLastQuestion
                    ? "Última pregunta: confirma para enviar el intento."
                    : "Confirma para continuar a la siguiente pregunta."}
            </AppText>
            <AppButton
              disabled={!selectedKey || !canInteract}
              onPress={submit}
              rightIcon={
                <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
              }
            >
              {isSubmitting
                ? "Enviando..."
                : isLastQuestion
                  ? "Enviar respuestas"
                  : "Confirmar"}
            </AppButton>
          </View>
        </View>
      </View>
    </AppScreen>
  );
}
