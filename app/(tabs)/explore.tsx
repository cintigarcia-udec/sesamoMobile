import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View, useWindowDimensions } from "react-native";

import { AppCard } from "@/components/design/app-card";
import { AppInput } from "@/components/design/app-input";
import { AppScreen } from "@/components/design/app-screen";
import { AppText } from "@/components/design/app-text";
import { TopAppBar } from "@/components/design/top-app-bar";
import { useThemeColor } from "@/hooks/use-theme-color";

const CATEGORIES = [
  {
    key: "cat-1",
    title: "Logic Systems",
    icon: "account-tree",
  },
  {
    key: "cat-2",
    title: "Math for Systems",
    icon: "functions",
  },
];

const QUESTIONNAIRES = [
  {
    id: "q-1",
    categoryId: "cat-1",
    title: "Algorithms & Complexity",
    description:
      "Test your knowledge on Big O notation and sorting algorithms.",
    duration: "15 min",
  },
  {
    id: "q-2",
    categoryId: "cat-2",
    title: "Discrete Mathematics",
    description: "Graphs, logic and proofs.",
    duration: "20 min",
  },
];

export default function ExploreScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const primary = useThemeColor({}, "primary");
  const surfaceHighest = useThemeColor({}, "surfaceContainerHighest");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredQuestionnaires = QUESTIONNAIRES.filter((q) => {
    const matchesSearch = q.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? q.categoryId === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <AppScreen
      scroll
      contentContainerStyle={{
        paddingTop: 92,
        paddingHorizontal: 20,
        maxWidth: 1100,
        width: "100%",
        alignSelf: "center",
        gap: 24,
      }}
    >
      <TopAppBar
        title="Catálogo de Cuestionarios"
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
          Explora
        </AppText>
        <AppText
          variant="body"
          colorName="secondary"
          style={{ opacity: 0.85, maxWidth: 720 }}
        >
          Encuentra cuestionarios organizados por categorías para evaluar tu
          conocimiento.
        </AppText>
      </View>

      <AppInput
        placeholder="Buscar cuestionarios..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        accessibilityLabel="Buscar cuestionarios por título"
      />

      <View style={{ gap: 12 }}>
        <AppText variant="title">Categorías</AppText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}
        >
          <Pressable
            onPress={() => setSelectedCategory(null)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor:
                selectedCategory === null ? primary : surfaceHighest,
            }}
          >
            <AppText
              colorName={selectedCategory === null ? "onPrimary" : "primary"}
            >
              Todas
            </AppText>
          </Pressable>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.key}
              onPress={() => setSelectedCategory(cat.key)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor:
                  selectedCategory === cat.key ? primary : surfaceHighest,
              }}
            >
              <AppText
                colorName={
                  selectedCategory === cat.key ? "onPrimary" : "primary"
                }
              >
                {cat.title}
              </AppText>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={{ gap: 12 }}>
        <AppText variant="title">Cuestionarios Disponibles</AppText>
        {filteredQuestionnaires.length === 0 ? (
          <AppText variant="body" colorName="secondary">
            No se encontraron cuestionarios.
          </AppText>
        ) : (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14 }}>
            {filteredQuestionnaires.map((q) => (
              <Pressable
                key={q.id}
                accessibilityRole="button"
                accessibilityLabel={`Abrir detalle de ${q.title}`}
                onPress={() => router.push(`/quiz?id=${q.id}` as any)}
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
                      <MaterialIcons name="quiz" size={22} color={primary} />
                    </View>
                    <MaterialIcons
                      name="chevron-right"
                      size={22}
                      color={primary}
                    />
                  </View>
                  <View style={{ gap: 4 }}>
                    <AppText variant="title">{q.title}</AppText>
                    <AppText
                      variant="labelCaps"
                      colorName="secondary"
                      style={{ opacity: 0.8 }}
                    >
                      {q.duration}
                    </AppText>
                  </View>
                  <AppText
                    variant="body"
                    colorName="secondary"
                    numberOfLines={2}
                  >
                    {q.description}
                  </AppText>
                </AppCard>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </AppScreen>
  );
}
