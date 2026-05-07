import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  View,
  useWindowDimensions,
} from "react-native";

import { AdminShell } from "@/components/admin/admin-shell";
import { AppCard } from "@/components/design/app-card";
import { AppText } from "@/components/design/app-text";
import { AppInput } from "@/components/design/app-input";
import { AppButton } from "@/components/design/app-button";
import { ApiError, api, type School } from "@/constants/api";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function AdminSchoolsScreen() {
  const { width } = useWindowDimensions();
  const [search, setSearch] = useState("");
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<School | null>(null);
  const [name, setName] = useState("");
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const surfaceLow = useThemeColor({}, "surfaceContainerLow");
  const surfaceLowest = useThemeColor({}, "surfaceContainerLowest");
  const errorColor = useThemeColor({}, "error");
  const primary = useThemeColor({}, "primary");

  const load = async () => {
    setIsLoading(true);
    setError("");
    try {
      const items = await api.schools.list({ skip: 0, limit: 500 });
      setSchools(items);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudieron cargar las escuelas.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return schools;
    return schools.filter((s) => s.name.toLowerCase().includes(q));
  }, [schools, search]);

  const openCreate = () => {
    setEditing(null);
    setName("");
    setFormError("");
    setIsModalOpen(true);
  };

  const openEdit = (s: School) => {
    setEditing(s);
    setName(s.name);
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
  };

  const save = async () => {
    if (isSaving) return;
    const trimmed = name.trim();
    if (!trimmed) {
      setFormError("El nombre es requerido.");
      return;
    }
    setIsSaving(true);
    setFormError("");
    try {
      if (editing) {
        await api.schools.update(editing.id, { name: trimmed });
      } else {
        await api.schools.create({ name: trimmed });
      }
      setIsModalOpen(false);
      await load();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "No se pudo guardar la escuela.");
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id: number) => {
    try {
      await api.schools.delete(id);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo eliminar la escuela.");
    }
  };

  return (
    <AdminShell
      active="schools"
      title="Gestión de Escuelas"
      right={
        <AppButton 
          variant="primary" 
          onPress={openCreate}
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
          {isLoading ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <ActivityIndicator color={primary} />
              <AppText variant="body" colorName="secondary">
                Cargando...
              </AppText>
            </View>
          ) : error ? (
            <AppText variant="body" colorName="secondary">
              {error}
            </AppText>
          ) : filtered.length === 0 ? (
            <AppText variant="body" colorName="secondary">
              No hay escuelas.
            </AppText>
          ) : (
            filtered.map((s) => (
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
                    <AppButton variant="secondary" onPress={() => openEdit(s)}>
                      Editar
                    </AppButton>
                    <AppButton
                      variant="secondary"
                      textStyle={{ color: errorColor }}
                      onPress={() => remove(s.id)}
                    >
                      Eliminar
                    </AppButton>
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </View>
      </View>

      <Modal visible={isModalOpen} transparent animationType="fade" onRequestClose={closeModal}>
        <Pressable
          onPress={closeModal}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", padding: 18, justifyContent: "center" }}
        >
          <Pressable onPress={() => {}} style={{ width: "100%", maxWidth: 560, alignSelf: "center" }}>
            <AppCard tone="lowest" style={{ gap: 12 }}>
              <AppText variant="title" colorName="primary">
                {editing ? "Editar escuela" : "Crear escuela"}
              </AppText>
              <View style={{ gap: 8 }}>
                <AppText variant="labelCaps" colorName="secondary" style={{ opacity: 0.8 }}>
                  Nombre
                </AppText>
                <AppInput value={name} onChangeText={setName} placeholder="Nombre de la escuela" />
                {formError ? (
                  <AppText variant="labelCaps" colorName="error">
                    {formError}
                  </AppText>
                ) : null}
              </View>
              <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 10 }}>
                <AppButton variant="tertiary" onPress={closeModal}>
                  Cancelar
                </AppButton>
                <AppButton onPress={save}>
                  {isSaving ? "Guardando..." : "Guardar"}
                </AppButton>
              </View>
            </AppCard>
          </Pressable>
        </Pressable>
      </Modal>
    </AdminShell>
  );
}
