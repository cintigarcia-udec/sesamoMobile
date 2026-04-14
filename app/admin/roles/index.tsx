import { useState } from "react";
import { View, Pressable, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

import { AdminShell } from "@/components/admin/admin-shell";
import { AppText } from "@/components/design/app-text";
import { AppInput } from "@/components/design/app-input";
import { AppButton } from "@/components/design/app-button";
import { useThemeColor } from "@/hooks/use-theme-color";

const MOCK_ROLES = [
  { id: "r-1", name: "Estudiante", description: "Acceso básico a cursos" },
  { id: "r-2", name: "Administrador", description: "Acceso total" },
];

export default function AdminRolesScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [search, setSearch] = useState("");
  
  const surfaceLow = useThemeColor({}, "surfaceContainerLow");
  const surfaceLowest = useThemeColor({}, "surfaceContainerLowest");
  const errorColor = useThemeColor({}, "error");
  const primary = useThemeColor({}, "primary");

  const filtered = MOCK_ROLES.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell
      active="roles"
      title="Gestión de Roles"
      right={
        <AppButton 
          variant="primary" 
          onPress={() => {}}
        >
          Crear Rol
        </AppButton>
      }
    >
      <View style={{ gap: 24, paddingBottom: 40 }}>
        <AppInput
          placeholder="Buscar rol..."
          value={search}
          onChangeText={setSearch}
        />

        <View style={{ gap: 8 }}>
          {filtered.map((r) => (
            <Pressable
              key={r.id}
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
                  <AppText variant="title">{r.name}</AppText>
                  <AppText variant="labelCaps" colorName="secondary">
                    {r.description} | ID: {r.id}
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
