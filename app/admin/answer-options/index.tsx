import { useState } from "react";
import { View, Pressable, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

import { AdminShell } from "@/components/admin/admin-shell";
import { AppText } from "@/components/design/app-text";
import { AppInput } from "@/components/design/app-input";
import { AppButton } from "@/components/design/app-button";
import { useThemeColor } from "@/hooks/use-theme-color";

const MOCK_OPTIONS = [
  { id: "o-1", text: "O(n^2)", isCorrect: false, questionId: "q-1" },
  { id: "o-2", text: "O(n log n)", isCorrect: true, questionId: "q-1" },
];

export default function AdminAnswerOptionsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [search, setSearch] = useState("");
  
  const surfaceLow = useThemeColor({}, "surfaceContainerLow");
  const surfaceLowest = useThemeColor({}, "surfaceContainerLowest");
  const errorColor = useThemeColor({}, "error");
  const primary = useThemeColor({}, "primary");

  const filtered = MOCK_OPTIONS.filter((o) =>
    o.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell
      active="answer-options"
      title="Gestión de Opciones"
      right={
        <AppButton 
          variant="primary" 
          onPress={() => {}}
        >
          Crear Opción
        </AppButton>
      }
    >
      <View style={{ gap: 24, paddingBottom: 40 }}>
        <AppInput
          placeholder="Buscar opción..."
          value={search}
          onChangeText={setSearch}
        />

        <View style={{ gap: 8 }}>
          {filtered.map((o) => (
            <Pressable
              key={o.id}
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
                  <AppText variant="title">{o.text}</AppText>
                  <AppText variant="labelCaps" colorName={o.isCorrect ? "primary" : "error"}>
                    {o.isCorrect ? "Correcta" : "Incorrecta"} | Q-ID: {o.questionId}
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
