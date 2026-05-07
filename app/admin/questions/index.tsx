import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  View,
  useWindowDimensions,
} from "react-native";

import { AdminShell } from "@/components/admin/admin-shell";
import { AppButton } from "@/components/design/app-button";
import { AppCard } from "@/components/design/app-card";
import { AppInput } from "@/components/design/app-input";
import { AppText } from "@/components/design/app-text";
import {
  ApiError,
  api,
  type Question,
  type Questionnaire,
} from "@/constants/api";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function AdminQuestionsScreen() {
  const { width } = useWindowDimensions();
  const [search, setSearch] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Question | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [questionnaireId, setQuestionnaireId] = useState("");
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const surfaceLow = useThemeColor({}, "surfaceContainerLow");
  const surfaceLowest = useThemeColor({}, "surfaceContainerLowest");
  const primary = useThemeColor({}, "primary");
  const errorColor = useThemeColor({}, "error");

  const load = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [qs, qn] = await Promise.all([
        api.questions.list({ skip: 0, limit: 2000 }),
        api.questionnaires.list({ skip: 0, limit: 2000 }),
      ]);
      setQuestions(qs);
      setQuestionnaires(qn);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudieron cargar las preguntas.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const questionnaireById = useMemo(() => {
    const map = new Map<number, Questionnaire>();
    for (const q of questionnaires) map.set(q.id, q);
    return map;
  }, [questionnaires]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return questions;
    return questions.filter((it) => {
      const qn = questionnaireById.get(it.questionnaire_id);
      const hay =
        `${it.question_text} ${it.id} ${it.questionnaire_id} ${qn?.questionnaire_number ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [questions, search, questionnaireById]);

  const openCreate = () => {
    setEditing(null);
    setQuestionText("");
    setQuestionnaireId("");
    setFormError("");
    setIsModalOpen(true);
  };

  const openEdit = (q: Question) => {
    setEditing(q);
    setQuestionText(q.question_text);
    setQuestionnaireId(String(q.questionnaire_id));
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
  };

  const save = async () => {
    if (isSaving) return;
    const text = questionText.trim();
    const qnId = Number(questionnaireId.trim());
    if (!text) {
      setFormError("question_text es requerido.");
      return;
    }
    if (!Number.isFinite(qnId) || qnId <= 0) {
      setFormError("questionnaire_id debe ser un entero positivo.");
      return;
    }
    setIsSaving(true);
    setFormError("");
    try {
      if (editing) {
        await api.questions.update(editing.id, {
          question_text: text,
          questionnaire_id: qnId,
        });
      } else {
        await api.questions.create({
          question_text: text,
          questionnaire_id: qnId,
        });
      }
      setIsModalOpen(false);
      await load();
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.message
          : "No se pudo guardar la pregunta.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id: number) => {
    try {
      await api.questions.delete(id);
      await load();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudo eliminar la pregunta.",
      );
    }
  };

  return (
    <AdminShell
      active="questions"
      title="Gestión de Preguntas"
      right={
        <AppButton variant="primary" onPress={openCreate}>
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
          {isLoading ? (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
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
              No hay preguntas.
            </AppText>
          ) : (
            filtered.map((q) => (
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
                  <View style={{ gap: 4, flex: 1 }}>
                    <AppText variant="title">{q.question_text}</AppText>
                    <AppText variant="labelCaps" colorName="secondary">
                      ID: {q.id} | questionnaire_id: {q.questionnaire_id}
                      {questionnaireById.get(q.questionnaire_id)
                        ? ` (#${questionnaireById.get(q.questionnaire_id)!.questionnaire_number})`
                        : ""}
                    </AppText>
                  </View>
                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <AppButton variant="secondary" onPress={() => openEdit(q)}>
                      Editar
                    </AppButton>
                    <AppButton
                      variant="secondary"
                      textStyle={{ color: errorColor }}
                      onPress={() => remove(q.id)}
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

      <Modal
        visible={isModalOpen}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Pressable
          onPress={closeModal}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.45)",
            padding: 18,
            justifyContent: "center",
          }}
        >
          <Pressable
            onPress={() => {}}
            style={{ width: "100%", maxWidth: 680, alignSelf: "center" }}
          >
            <AppCard tone="lowest" style={{ gap: 12 }}>
              <AppText variant="title" colorName="primary">
                {editing ? "Editar pregunta" : "Crear pregunta"}
              </AppText>
              <View style={{ gap: 10 }}>
                <AppText
                  variant="labelCaps"
                  colorName="secondary"
                  style={{ opacity: 0.8 }}
                >
                  question_text
                </AppText>
                <AppInput
                  value={questionText}
                  onChangeText={setQuestionText}
                  placeholder="Texto de la pregunta"
                  multiline
                />
              </View>
              <View style={{ gap: 10 }}>
                <AppText
                  variant="labelCaps"
                  colorName="secondary"
                  style={{ opacity: 0.8 }}
                >
                  questionnaire_id
                </AppText>
                <AppInput
                  value={questionnaireId}
                  onChangeText={setQuestionnaireId}
                  placeholder="Ej: 1"
                  keyboardType="numeric"
                />
              </View>
              {formError ? (
                <AppText variant="labelCaps" colorName="error">
                  {formError}
                </AppText>
              ) : null}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  gap: 10,
                }}
              >
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
