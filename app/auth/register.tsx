import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import { AppButton } from "@/components/design/app-button";
import { AppInput } from "@/components/design/app-input";
import { AppScreen } from "@/components/design/app-screen";
import { AppText } from "@/components/design/app-text";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [residentialAddress, setResidentialAddress] = useState("");
  const [typeDocumentIdentity, setTypeDocumentIdentity] = useState("");
  const [documentIdentity, setDocumentIdentity] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [password, setPassword] = useState("");

  const [schools, setSchools] = useState<
    {
      id: number;
      name?: string;
      school_name?: string;
      title?: string;
    }[]
  >([]);
  const [isSchoolsLoading, setIsSchoolsLoading] = useState(false);
  const [schoolsError, setSchoolsError] = useState("");
  const [isSchoolsModalOpen, setIsSchoolsModalOpen] = useState(false);

  const [nameError, setNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [residentialAddressError, setResidentialAddressError] = useState("");
  const [typeDocumentIdentityError, setTypeDocumentIdentityError] =
    useState("");
  const [documentIdentityError, setDocumentIdentityError] = useState("");
  const [schoolIdError, setSchoolIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const errorColor = useThemeColor({}, "error");
  const primary = useThemeColor({}, "primary");
  const surfaceLow = useThemeColor({}, "surfaceContainerLow");
  const surfaceHighest = useThemeColor({}, "surfaceContainerHighest");
  const outlineVariant = useThemeColor({}, "outlineVariant");

  const API_BASE_URL = (
    process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1"
  ).replace(/\/+$/, "");

  const DOCUMENT_TYPES = [
    { label: "CC", value: "cc" },
    { label: "CE", value: "ce" },
    { label: "TI", value: "ti" },
    { label: "PASAPORTE", value: "passport" },
  ] as const;

  const schoolsUrl = useMemo(
    () => `${API_BASE_URL}/schools/?skip=0&limit=100`,
    [API_BASE_URL],
  );

  const selectedSchool = useMemo(() => {
    const id = Number(schoolId);
    if (!Number.isFinite(id)) return null;
    return schools.find((s) => s.id === id) ?? null;
  }, [schoolId, schools]);

  const selectedSchoolLabel = useMemo(() => {
    if (!selectedSchool) return "";
    return (
      selectedSchool.name ??
      selectedSchool.school_name ??
      selectedSchool.title ??
      `Escuela ${selectedSchool.id}`
    );
  }, [selectedSchool]);

  const getNameError = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "El nombre es requerido.";
    if (trimmed.length < 2)
      return "El nombre debe tener al menos 2 caracteres.";
    return "";
  };

  const getLastNameError = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "El apellido es requerido.";
    if (trimmed.length < 2)
      return "El apellido debe tener al menos 2 caracteres.";
    return "";
  };

  const getEmailError = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "El correo es requerido.";
    if (!/^\S+@\S+\.\S+$/.test(trimmed)) return "Formato de correo inválido.";
    return "";
  };

  const getResidentialAddressError = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "La dirección es requerida.";
    if (trimmed.length < 5) return "La dirección debe ser más específica.";
    return "";
  };

  const getTypeDocumentIdentityError = (value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) return "El tipo de documento es requerido.";
    const normalized = trimmed === "pasaporte" ? "passport" : trimmed;
    const allowed = DOCUMENT_TYPES.some((t) => t.value === normalized);
    if (!allowed) return "Selecciona un tipo de documento válido.";
    return "";
  };

  const getDocumentIdentityError = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "El número de documento es requerido.";
    if (!/^[0-9]{6,20}$/.test(trimmed))
      return "El número de documento debe ser numérico.";
    return "";
  };

  const getSchoolIdError = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "La escuela es requerida.";
    const parsed = Number(trimmed);
    if (!Number.isInteger(parsed) || parsed <= 0)
      return "La escuela debe ser un número válido.";
    return "";
  };

  const getPasswordError = (value: string) => {
    if (!value) return "La contraseña es requerida.";
    if (value.length < 6)
      return "La contraseña debe tener al menos 6 caracteres.";
    return "";
  };

  const validateName = (text: string) => {
    setName(text);
    setNameError(getNameError(text));
  };

  const validateLastName = (text: string) => {
    setLastName(text);
    setLastNameError(getLastNameError(text));
  };

  const validateEmail = (text: string) => {
    setEmail(text);
    setEmailError(getEmailError(text));
  };

  const validateResidentialAddress = (text: string) => {
    setResidentialAddress(text);
    setResidentialAddressError(getResidentialAddressError(text));
  };

  const validateDocumentIdentity = (text: string) => {
    setDocumentIdentity(text);
    setDocumentIdentityError(getDocumentIdentityError(text));
  };

  const fetchSchools = useCallback(async () => {
    setIsSchoolsLoading(true);
    setSchoolsError("");

    try {
      const response = await fetch(schoolsUrl, { method: "GET" });
      if (!response.ok) {
        setSchoolsError(
          "No se pudieron cargar las escuelas. Intenta nuevamente.",
        );
        return;
      }

      const data = (await response.json().catch(() => null)) as unknown;

      const items = Array.isArray(data)
        ? data
        : ((data as { items?: unknown } | null)?.items ??
          (data as { data?: unknown } | null)?.data ??
          []);

      if (!Array.isArray(items)) {
        setSchoolsError("Respuesta inválida al cargar escuelas.");
        return;
      }

      const normalized = items
        .map((raw) => raw as Record<string, unknown>)
        .map((raw) => ({
          id: Number(raw.id),
          name: typeof raw.name === "string" ? raw.name : undefined,
          school_name:
            typeof raw.school_name === "string" ? raw.school_name : undefined,
          title: typeof raw.title === "string" ? raw.title : undefined,
        }))
        .filter((s) => Number.isFinite(s.id));

      setSchools(normalized);
      if (normalized.length === 0) {
        setSchoolsError("No hay escuelas disponibles.");
      }
    } catch {
      setSchoolsError("No se pudo conectar al servidor para cargar escuelas.");
    } finally {
      setIsSchoolsLoading(false);
    }
  }, [schoolsUrl]);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const validatePassword = (text: string) => {
    setPassword(text);
    setPasswordError(getPasswordError(text));
  };

  const handleRegister = async () => {
    const nextNameError = getNameError(name);
    const nextLastNameError = getLastNameError(lastName);
    const nextEmailError = getEmailError(email);
    const nextResidentialAddressError =
      getResidentialAddressError(residentialAddress);
    const nextTypeDocumentIdentityError =
      getTypeDocumentIdentityError(typeDocumentIdentity);
    const nextDocumentIdentityError =
      getDocumentIdentityError(documentIdentity);
    const nextSchoolIdError = getSchoolIdError(schoolId);
    const nextPasswordError = getPasswordError(password);

    setNameError(nextNameError);
    setLastNameError(nextLastNameError);
    setEmailError(nextEmailError);
    setResidentialAddressError(nextResidentialAddressError);
    setTypeDocumentIdentityError(nextTypeDocumentIdentityError);
    setDocumentIdentityError(nextDocumentIdentityError);
    setSchoolIdError(nextSchoolIdError);
    setPasswordError(nextPasswordError);

    if (
      nextNameError ||
      nextLastNameError ||
      nextEmailError ||
      nextResidentialAddressError ||
      nextTypeDocumentIdentityError ||
      nextDocumentIdentityError ||
      nextSchoolIdError ||
      nextPasswordError
    ) {
      return;
    }

    setIsLoading(true);
    setGeneralError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          residential_address: residentialAddress.trim(),
          type_document_identity: typeDocumentIdentity.trim().toLowerCase(),
          document_identity: documentIdentity.trim(),
          school_id: Number(schoolId.trim()),
          password,
        }),
      });

      if (response.status === 201) {
        router.replace("/auth/login");
        return;
      }

      const data = (await response.json().catch(() => null)) as {
        detail?: string | { msg?: string }[];
      } | null;

      const message =
        typeof data?.detail === "string"
          ? data.detail
          : Array.isArray(data?.detail) && data?.detail?.[0]?.msg
            ? data.detail[0].msg
            : "No se pudo completar el registro. Intenta nuevamente.";
      setGeneralError(message);
    } catch {
      setGeneralError(
        "No se pudo conectar con el servidor. Revisa tu conexión e intenta nuevamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppScreen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 24,
          }}
        >
          <View style={{ marginBottom: 40 }}>
            <AppText
              variant="display"
              colorName="primary"
              style={{ marginBottom: 8 }}
            >
              Crear Cuenta
            </AppText>
            <AppText variant="body" colorName="secondary">
              Únete a Sésamo y empieza a aprender.
            </AppText>
          </View>

          {generalError ? (
            <View
              style={{
                backgroundColor: `${errorColor}22`,
                padding: 12,
                borderRadius: 8,
                marginBottom: 16,
              }}
              accessibilityLiveRegion="polite"
            >
              <AppText variant="label" colorName="error">
                {generalError}
              </AppText>
            </View>
          ) : null}

          <View style={{ gap: 16 }}>
            <View>
              <AppText variant="label" style={{ marginBottom: 8 }}>
                Nombre
              </AppText>
              <AppInput
                placeholder="Tu nombre"
                value={name}
                onChangeText={validateName}
                autoCapitalize="words"
                accessibilityLabel="Campo de nombre"
                accessibilityHint="Ingresa tu nombre"
              />
              {nameError ? (
                <AppText
                  variant="labelCaps"
                  colorName="error"
                  style={{ marginTop: 4 }}
                >
                  {nameError}
                </AppText>
              ) : null}
            </View>

            <View>
              <AppText variant="label" style={{ marginBottom: 8 }}>
                Apellido
              </AppText>
              <AppInput
                placeholder="Tu apellido"
                value={lastName}
                onChangeText={validateLastName}
                autoCapitalize="words"
                accessibilityLabel="Campo de apellido"
                accessibilityHint="Ingresa tu apellido"
              />
              {lastNameError ? (
                <AppText
                  variant="labelCaps"
                  colorName="error"
                  style={{ marginTop: 4 }}
                >
                  {lastNameError}
                </AppText>
              ) : null}
            </View>

            <View>
              <AppText variant="label" style={{ marginBottom: 8 }}>
                Correo Electrónico
              </AppText>
              <AppInput
                placeholder="ejemplo@correo.com"
                value={email}
                onChangeText={validateEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                accessibilityLabel="Campo de correo electrónico"
                accessibilityHint="Ingresa un correo válido"
              />
              {emailError ? (
                <AppText
                  variant="labelCaps"
                  colorName="error"
                  style={{ marginTop: 4 }}
                >
                  {emailError}
                </AppText>
              ) : null}
            </View>

            <View>
              <AppText variant="label" style={{ marginBottom: 8 }}>
                Dirección de residencia
              </AppText>
              <AppInput
                placeholder="Tu dirección"
                value={residentialAddress}
                onChangeText={validateResidentialAddress}
                autoCapitalize="sentences"
                accessibilityLabel="Campo de dirección de residencia"
                accessibilityHint="Ingresa tu dirección de residencia"
              />
              {residentialAddressError ? (
                <AppText
                  variant="labelCaps"
                  colorName="error"
                  style={{ marginTop: 4 }}
                >
                  {residentialAddressError}
                </AppText>
              ) : null}
            </View>

            <View>
              <AppText variant="label" style={{ marginBottom: 8 }}>
                Tipo de documento
              </AppText>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {DOCUMENT_TYPES.map((option) => {
                  const isSelected = typeDocumentIdentity === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => {
                        setTypeDocumentIdentity(option.value);
                        setTypeDocumentIdentityError("");
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`Tipo de documento ${option.label}`}
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                        borderRadius: 999,
                        borderWidth: 1,
                        borderColor: outlineVariant,
                        backgroundColor: isSelected ? primary : surfaceLow,
                      }}
                    >
                      <AppText
                        variant="label"
                        colorName={isSelected ? "onPrimary" : "primary"}
                        style={{ letterSpacing: 0.2 }}
                      >
                        {option.label}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
              {typeDocumentIdentityError ? (
                <AppText
                  variant="labelCaps"
                  colorName="error"
                  style={{ marginTop: 4 }}
                >
                  {typeDocumentIdentityError}
                </AppText>
              ) : null}
            </View>

            <View>
              <AppText variant="label" style={{ marginBottom: 8 }}>
                Número de documento
              </AppText>
              <AppInput
                placeholder="1007600120"
                value={documentIdentity}
                onChangeText={validateDocumentIdentity}
                keyboardType="number-pad"
                autoCapitalize="none"
                accessibilityLabel="Campo de número de documento"
                accessibilityHint="Ingresa tu número de documento"
              />
              {documentIdentityError ? (
                <AppText
                  variant="labelCaps"
                  colorName="error"
                  style={{ marginTop: 4 }}
                >
                  {documentIdentityError}
                </AppText>
              ) : null}
            </View>

            <View>
              <AppText variant="label" style={{ marginBottom: 8 }}>
                ID de escuela
              </AppText>
              <Pressable
                onPress={() => setIsSchoolsModalOpen(true)}
                accessibilityRole="button"
                accessibilityLabel="Seleccionar escuela"
                style={{
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: outlineVariant,
                  backgroundColor: surfaceLow,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <View style={{ flex: 1 }}>
                  <AppText
                    variant="body"
                    colorName={selectedSchoolLabel ? "primary" : "secondary"}
                  >
                    {selectedSchoolLabel || "Selecciona una escuela"}
                  </AppText>
                  {schoolsError ? (
                    <AppText
                      variant="labelCaps"
                      colorName="error"
                      style={{ marginTop: 4 }}
                    >
                      {schoolsError}
                    </AppText>
                  ) : null}
                </View>
                {isSchoolsLoading ? (
                  <ActivityIndicator color={primary} />
                ) : (
                  <AppText variant="label" colorName="primary">
                    Cambiar
                  </AppText>
                )}
              </Pressable>
              {schoolIdError ? (
                <AppText
                  variant="labelCaps"
                  colorName="error"
                  style={{ marginTop: 4 }}
                >
                  {schoolIdError}
                </AppText>
              ) : null}
            </View>

            <View>
              <AppText variant="label" style={{ marginBottom: 8 }}>
                Contraseña
              </AppText>
              <AppInput
                placeholder="********"
                value={password}
                onChangeText={validatePassword}
                secureTextEntry
                accessibilityLabel="Campo de contraseña"
                accessibilityHint="Crea una contraseña de al menos 6 caracteres"
              />
              {passwordError ? (
                <AppText
                  variant="labelCaps"
                  colorName="error"
                  style={{ marginTop: 4 }}
                >
                  {passwordError}
                </AppText>
              ) : null}
            </View>
          </View>

          <View style={{ marginTop: 32, gap: 16 }}>
            <AppButton
              onPress={handleRegister}
              disabled={
                isLoading ||
                !!nameError ||
                !!lastNameError ||
                !!emailError ||
                !!residentialAddressError ||
                !!typeDocumentIdentityError ||
                !!documentIdentityError ||
                !!schoolIdError ||
                !!passwordError ||
                !name ||
                !lastName ||
                !email ||
                !residentialAddress ||
                !typeDocumentIdentity ||
                !documentIdentity ||
                !schoolId ||
                !password
              }
              accessibilityLabel="Botón de Registrarse"
            >
              {isLoading ? "Creando cuenta..." : "Regístrate"}
            </AppButton>

            <View
              style={{ flexDirection: "row", justifyContent: "center", gap: 4 }}
            >
              <AppText variant="body">¿Ya tienes cuenta?</AppText>
              <Pressable
                onPress={() => router.back()}
                accessibilityRole="button"
                accessibilityLabel="Ir a iniciar sesión"
              >
                <AppText variant="bodyStrong" colorName="primary">
                  Inicia Sesión
                </AppText>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal
        animationType="slide"
        transparent
        visible={isSchoolsModalOpen}
        onRequestClose={() => setIsSchoolsModalOpen(false)}
      >
        <Pressable
          onPress={() => setIsSchoolsModalOpen(false)}
          style={{
            flex: 1,
            backgroundColor: "#00000066",
            padding: 18,
            justifyContent: "flex-end",
          }}
        >
          <Pressable
            onPress={() => null}
            style={{
              backgroundColor: surfaceHighest,
              borderRadius: 18,
              padding: 16,
              maxHeight: "80%",
              borderWidth: 1,
              borderColor: outlineVariant,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
                gap: 12,
              }}
            >
              <AppText variant="headline" colorName="primary">
                Selecciona tu escuela
              </AppText>
              <Pressable
                onPress={() => setIsSchoolsModalOpen(false)}
                accessibilityRole="button"
                accessibilityLabel="Cerrar selección de escuela"
              >
                <AppText variant="label" colorName="primary">
                  Cerrar
                </AppText>
              </Pressable>
            </View>

            {schoolsError ? (
              <View style={{ gap: 10, marginBottom: 12 }}>
                <AppText variant="body" colorName="error">
                  {schoolsError}
                </AppText>
                <AppButton
                  onPress={fetchSchools}
                  disabled={isSchoolsLoading}
                  accessibilityLabel="Reintentar cargar escuelas"
                >
                  {isSchoolsLoading ? "Cargando..." : "Reintentar"}
                </AppButton>
              </View>
            ) : null}

            <ScrollView
              contentContainerStyle={{ gap: 10, paddingBottom: 6 }}
              showsVerticalScrollIndicator={false}
            >
              {schools.map((s) => {
                const label =
                  s.name ?? s.school_name ?? s.title ?? `Escuela ${s.id}`;
                const isSelected = String(s.id) === schoolId;
                return (
                  <Pressable
                    key={s.id}
                    onPress={() => {
                      setSchoolId(String(s.id));
                      setSchoolIdError("");
                      setIsSchoolsModalOpen(false);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Seleccionar escuela ${label}`}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: outlineVariant,
                      backgroundColor: isSelected ? primary : surfaceLow,
                    }}
                  >
                    <AppText
                      variant="bodyStrong"
                      colorName={isSelected ? "onPrimary" : "primary"}
                    >
                      {label}
                    </AppText>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </AppScreen>
  );
}
