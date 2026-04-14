import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemo, useState } from "react";
import { Pressable, View, useWindowDimensions } from "react-native";

import { AdminShell } from "@/components/admin/admin-shell";
import { AppButton } from "@/components/design/app-button";
import { AppCard } from "@/components/design/app-card";
import { AppInput } from "@/components/design/app-input";
import { AppText } from "@/components/design/app-text";
import { useThemeColor } from "@/hooks/use-theme-color";

type Role = "Student" | "Teacher" | "Admin";
type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "Active" | "Suspended";
};

const roleLabel = (role: Role) =>
  role === "Student" ? "Estudiante" : role === "Teacher" ? "Docente" : "Admin";

const statusLabel = (status: User["status"]) =>
  status === "Active" ? "Activo" : "Suspendido";

export default function AdminUsersScreen() {
  const { width } = useWindowDimensions();
  const primary = useThemeColor({}, "primary");
  const secondary = useThemeColor({}, "secondary");
  const primaryContainer = useThemeColor({}, "primaryContainer");
  const onPrimaryContainer = useThemeColor({}, "onPrimaryContainer");
  const error = useThemeColor({}, "error");
  const surfaceHighest = useThemeColor({}, "surfaceContainerHighest");
  const surfaceLow = useThemeColor({}, "surfaceContainerLow");

  const [query, setQuery] = useState("");
  const [role, setRole] = useState<Role | "All">("All");

  const users = useMemo<User[]>(
    () => [
      {
        id: "S-1042",
        name: "Alex Rivera",
        email: "a.rivera@polytechnic.edu",
        role: "Student",
        status: "Active",
      },
      {
        id: "S-2931",
        name: "María Gómez",
        email: "m.gomez@school.edu",
        role: "Student",
        status: "Active",
      },
      {
        id: "T-021",
        name: "Prof. Hernández",
        email: "hernandez@school.edu",
        role: "Teacher",
        status: "Active",
      },
      {
        id: "A-001",
        name: "Engineering Admin",
        email: "admin@syntactic.io",
        role: "Admin",
        status: "Active",
      },
    ],
    [],
  );

  const filtered = users.filter((u) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q || `${u.id} ${u.name} ${u.email}`.toLowerCase().includes(q);
    const matchesRole = role === "All" || u.role === role;
    return matchesQuery && matchesRole;
  });

  return (
    <AdminShell
      active="users"
      title="Gestión de usuarios"
      right={
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View
            accessibilityLabel="Administrador"
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
      <View style={{ gap: 10 }}>
        <AppText
          variant="headline"
          colorName="primary"
          style={{
            fontSize: width >= 900 ? 56 : 42,
            lineHeight: width >= 900 ? 60 : 48,
          }}
        >
          Ecosistema de usuarios
        </AppText>
        <AppText
          variant="body"
          colorName="secondary"
          style={{ opacity: 0.9, maxWidth: 860 }}
        >
          Administra el acceso, monitorea la actividad y gestiona roles y estados de usuarios dentro de la plataforma.
        </AppText>
      </View>

      <View
        style={{
          flexDirection: width >= 900 ? "row" : "column",
          gap: 14,
          marginTop: 16,
        }}
      >
        <AppCard
          tone="lowest"
          style={{
            flex: width >= 900 ? 3 : undefined,
            borderRadius: 28,
            gap: 12,
          }}
        >
          <View
            style={{
              flexDirection: width >= 720 ? "row" : "column",
              gap: 10,
              alignItems: width >= 720 ? "center" : "stretch",
            }}
          >
            <View style={{ flex: 1 }}>
              <AppInput
                value={query}
                onChangeText={setQuery}
                placeholder="Buscar por nombre, correo o ID..."
                accessibilityLabel="Buscar usuarios"
              />
            </View>
            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cambiar rol"
                onPress={() =>
                  setRole((r) =>
                    r === "All"
                      ? "Student"
                      : r === "Student"
                        ? "Teacher"
                        : r === "Teacher"
                          ? "Admin"
                          : "All",
                  )
                }
                style={({ pressed }) => [
                  {
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    borderRadius: 12,
                    backgroundColor: pressed ? surfaceHighest : surfaceLow,
                  },
                ]}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <MaterialIcons name="group" size={18} color={secondary} />
                  <AppText variant="bodyStrong" colorName="secondary">
                    {role === "All" ? "Todos los roles" : roleLabel(role)}
                  </AppText>
                </View>
              </Pressable>
              <AppButton
                onPress={() => {}}
                leftIcon={
                  <MaterialIcons name="filter-list" size={18} color="#ffffff" />
                }
              >
                Aplicar filtros
              </AppButton>
            </View>
          </View>
        </AppCard>

        <AppCard
          tone="lowest"
          style={{
            flex: width >= 900 ? 1 : undefined,
            borderRadius: 28,
            gap: 10,
            backgroundColor: primaryContainer,
          }}
        >
          <MaterialIcons name="insights" size={26} color={onPrimaryContainer} />
          <AppText
            variant="labelCaps"
            style={{
              color: onPrimaryContainer,
              opacity: 0.75,
            }}
          >
            Sesiones activas
          </AppText>
          <AppText
            variant="headline"
            style={{ color: onPrimaryContainer, fontSize: 40 }}
          >
            1,284
          </AppText>
        </AppCard>
      </View>

      <View style={{ marginTop: 14, gap: 10 }}>
        {filtered.map((u) => (
          <AppCard
            key={u.id}
            tone="low"
            style={{ borderRadius: 22, padding: 0, overflow: "hidden" }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Abrir usuario ${u.name}`}
              onPress={() => {}}
              style={({ pressed }) => [
                {
                  padding: 16,
                  backgroundColor: pressed ? surfaceHighest : "transparent",
                },
              ]}
            >
              <View
                style={{
                  flexDirection: width >= 720 ? "row" : "column",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 16,
                      backgroundColor: `${primary}14`,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialIcons
                      name={
                        u.role === "Admin"
                          ? "security"
                          : u.role === "Teacher"
                            ? "school"
                            : "person"
                      }
                      size={22}
                      color={primary}
                    />
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <AppText variant="bodyStrong">{u.name}</AppText>
                    <AppText
                      variant="label"
                      colorName="secondary"
                      style={{ opacity: 0.85 }}
                    >
                      {u.email}
                    </AppText>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
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
                      {roleLabel(u.role)}
                    </AppText>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 999,
                      backgroundColor:
                        u.status === "Active" ? `${primary}14` : `${error}14`,
                    }}
                  >
                    <AppText
                      variant="labelCaps"
                      style={{
                        color: u.status === "Active" ? primary : error,
                      }}
                    >
                      {statusLabel(u.status)}
                    </AppText>
                  </View>
                  <AppText
                    variant="labelCaps"
                    colorName="secondary"
                    style={{ opacity: 0.7 }}
                  >
                    {u.id}
                  </AppText>
                  <MaterialIcons
                    name="chevron-right"
                    size={22}
                    color={secondary}
                  />
                </View>
              </View>
            </Pressable>
          </AppCard>
        ))}
        {filtered.length === 0 ? (
          <AppCard tone="low">
            <AppText variant="bodyStrong">No se encontraron usuarios</AppText>
            <AppText
              variant="label"
              colorName="secondary"
              style={{ opacity: 0.85, marginTop: 6 }}
            >
              Prueba quitando filtros o cambiando la búsqueda.
            </AppText>
          </AppCard>
        ) : null}
      </View>
    </AdminShell>
  );
}
