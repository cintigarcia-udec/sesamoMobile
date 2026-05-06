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
import { ApiError, api, type AnswerOption } from "@/constants/api";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function AdminAnswerOptionsScreen() {
  const { width } = useWindowDimensions();
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<AnswerOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<AnswerOption | null>(null);
  const [answer, setAnswer] = useState("");
  const [optionKey, setOptionKey] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
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
      const items = await api.answerOptions.list({ skip: 0, limit: 5000 });
      setOptions(items);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudieron cargar las opciones.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => {
      const hay = `${o.answer} ${o.option_key} ${o.question_id} ${o.id}`.toLowerCase();
      return hay.includes(q);
    });
  }, [options, search]);

  const openCreate = () => {
    setEditing(null);
    setAnswer("");
    setOptionKey("");
    setQuestionId("");
    setIsCorrect(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEdit = (o: AnswerOption) => {
    setEditing(o);
    setAnswer(o.answer);
    setOptionKey(o.option_key);
    setQuestionId(String(o.question_id));
    setIsCorrect(typeof o.is_correct === "boolean" ? o.is_correct : null);
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
  };

  const save = async () => {
    if (isSaving) return;
    const a = answer.trim();
    const k = optionKey.trim().toUpperCase();
    const qId = Number(questionId.trim());
    if (!a) {
      setFormError("answer es requerido.");
      return;
    }
    if (!k || k.length !== 1) {
      setFormError("option_key debe tener 1 caracter (A/B/C...).");
      return;
    }
    if (!Number.isFinite(qId) || qId <= 0) {
      setFormError("question_id debe ser un entero positivo.");
      return;
    }
    setIsSaving(true);
    setFormError("");
    try {
      if (editing) {
        await api.answerOptions.update(editing.id, {
          answer: a,
          option_key: k,
          question_id: qId,
          is_correct: isCorrect,
        });
      } else {
        await api.answerOptions.create({
          answer: a,
          option_key: k,
          question_id: qId,
          is_correct: isCorrect,
        });
      }
      setIsModalOpen(false);
      await load();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "No se pudo guardar la opción.");
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id: number) => {
    try {
      await api.answerOptions.delete(id);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo eliminar la opción.");
    }
  };

  return (
    <AdminShell
      active="answer-options"
      title="Gestión de Opciones"
      right={
        <AppButton 
          variant="primary" 
          onPress={openCreate}
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
              No hay opciones.
            </AppText>
          ) : (
            filtered.map((o) => (
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
                  <View style={{ gap: 4, flex: 1 }}>
                    <AppText variant="title">
                      {o.option_key}. {o.answer}
                    </AppText>
                    <AppText
                      variant="labelCaps"
                      colorName={o.is_correct ? "primary" : "secondary"}
                    >
                      {o.is_correct ? "Correcta" : "Sin marcar"} | question_id: {o.question_id} | ID: {o.id}
                    </AppText>
                  </View>
                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <AppButton variant="secondary" onPress={() => openEdit(o)}>
                      Editar
                    </AppButton>
                    <AppButton
                      variant="secondary"
                      textStyle={{ color: errorColor }}
                      onPress={() => remove(o.id)}
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
          <Pressable onPress={() => {}} style={{ width: "100%", maxWidth: 680, alignSelf: "center" }}>
            <AppCard tone="lowest" style={{ gap: 12 }}>
              <AppText variant="title" colorName="primary">
                {editing ? "Editar opción" : "Crear opción"}
              </AppText>
              <View style={{ gap: 10 }}>
                <AppText variant="labelCaps" colorName="secondary" style={{ opacity: 0.8 }}>
                  answer
                </AppText>
                <AppInput value={answer} onChangeText={setAnswer} placeholder="Texto de la opción" multiline />
              </View>
              <View style={{ flexDirection: width >= 720 ? "row" : "column", gap: 12 }}>
                <View style={{ flex: 1, gap: 10 }}>
                  <AppText variant="labelCaps" colorName="secondary" style={{ opacity: 0.8 }}>
                    option_key
                  </AppText>
                  <AppInput value={optionKey} onChangeText={setOptionKey} placeholder="A" maxLength={1} autoCapitalize="characters" />
                </View>
                <View style={{ flex: 1, gap: 10 }}>
                  <AppText variant="labelCaps" colorName="secondary" style={{ opacity: 0.8 }}>
                    question_id
                  </AppText>
                  <AppInput value={questionId} onChangeText={setQuestionId} placeholder="Ej: 10" keyboardType="numeric" />
                </View>
              </View>

              <View style={{ gap: 10 }}>
                <AppText variant="labelCaps" colorName="secondary" style={{ opacity: 0.8 }}>
                  is_correct
                </AppText>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <AppButton
                    variant={isCorrect === true ? "primary" : "secondary"}
                    onPress={() => setIsCorrect(true)}
                  >
                    Correcta
                  </AppButton>
                  <AppButton
                    variant={isCorrect === false ? "primary" : "secondary"}
                    onPress={() => setIsCorrect(false)}
                  >
                    Incorrecta
                  </AppButton>
                  <AppButton
                    variant={isCorrect === null ? "primary" : "secondary"}
                    onPress={() => setIsCorrect(null)}
                  >
                    Nulo
                  </AppButton>
                </View>
              </View>

              {formError ? (
                <AppText variant="labelCaps" colorName="error">
                  {formError}
                </AppText>
              ) : null}
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
