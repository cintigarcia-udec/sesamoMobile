import { useState } from "react";
import { View, Pressable, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

import { AdminShell } from "@/components/admin/admin-shell";
import { AppText } from "@/components/design/app-text";
import { AppInput } from "@/components/design/app-input";
import { AppButton } from "@/components/design/app-button";
import { useThemeColor } from "@/hooks/use-theme-color";

const MOCK_SCHOOLS = [
  { id: "s-1", name: "Escuela de Ingeniería" },
  { id: "s-2", name: "Escuela de Negocios" },
];

export default function AdminSchoolsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [search, setSearch] = useState("");
  
  const surfaceLow = useThemeColor({}, "surfaceContainerLow");
  const surfaceLowest = useThemeColor({}, "surfaceContainerLowest");
  const errorColor = useThemeColor({}, "error");
  const primary = useThemeColor({}, "primary");

  const filtered = MOCK_SCHOOLS.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell
      active="schools"
      title="Gestión de Escuelas"
      right={
        <AppButton 
          variant="primary" 
          onPress={() => {}}
        >
          Crear Escuela
        </AppButton>
      }
    >
      <View style={{ gap: 24, paddingBottom: 40 }}>
        <AppInput
          placeholder="Buscar escuela..."
          value={search}
          onChangeText={setSearch}
        />

        <View style={{ gap: 8 }}>
          {filtered.map((s) => (
            <Pressable
              key={s.id}
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
                  <AppText variant="title">{s.name}</AppText>
                  <AppText variant="labelCaps" colorName="secondary">
                    ID: {s.id}
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
