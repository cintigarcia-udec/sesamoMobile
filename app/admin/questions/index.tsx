import { useState } from "react";
import { View, Pressable, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { AdminShell } from "@/components/admin/admin-shell";
import { AppText } from "@/components/design/app-text";
import { AppInput } from "@/components/design/app-input";
import { AppButton } from "@/components/design/app-button";
import { useThemeColor } from "@/hooks/use-theme-color";

const MOCK_QUESTIONS = [
  { id: "q-1", title: "What is Big O?", type: "multiple_choice", questionnaireId: "qn-1" },
  { id: "q-2", title: "Which sorting is fastest?", type: "multiple_choice", questionnaireId: "qn-1" },
];

export default function AdminQuestionsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [search, setSearch] = useState("");
  
  const surfaceLow = useThemeColor({}, "surfaceContainerLow");
  const surfaceLowest = useThemeColor({}, "surfaceContainerLowest");
  const primary = useThemeColor({}, "primary");
  const errorColor = useThemeColor({}, "error");

  const filtered = MOCK_QUESTIONS.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell
      active="questions"
      title="Gestión de Preguntas"
      right={
        <AppButton 
          variant="primary" 
          onPress={() => {}}
        >
          Crear Pregunta
        </AppButton>
      }
    >
      <View style={{ gap: 24, paddingBottom: 40 }}>
        <AppInput
          placeholder="Buscar preguntas por título..."
          value={search}
          onChangeText={setSearch}
        />

        <View style={{ gap: 8 }}>
          {filtered.map((q) => (
            <Pressable
              key={q.id}
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
                  gap: 16,
                }}
              >
                <View style={{ gap: 4 }}>
                  <AppText variant="title">{q.title}</AppText>
                  <AppText variant="labelCaps" colorName="secondary">
                    Tipo: {q.type} | ID: {q.id}
                  </AppText>
                </View>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <AppButton variant="secondary" onPress={() => {}}>
                    Editar
                  </AppButton>
                  <AppButton variant="secondary" textStyle={{ color: errorColor }} onPress={() => {}}>
                    Eliminar
                  </AppButton>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </AdminShell>
  );
}
