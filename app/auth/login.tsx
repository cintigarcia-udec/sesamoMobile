import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

import { AppButton } from "@/components/design/app-button";
import { AppInput } from "@/components/design/app-input";
import { AppScreen } from "@/components/design/app-screen";
import { AppText } from "@/components/design/app-text";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const errorColor = useThemeColor({}, "error");

  const API_BASE_URL = (
    process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1"
  ).replace(/\/+$/, "");

  const ACCESS_TOKEN_KEY = "sesamo.access_token";

  const getEmailError = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "El correo es requerido.";
    if (!/^\S+@\S+\.\S+$/.test(trimmed)) return "Formato de correo inválido.";
    return "";
  };

  const getPasswordError = (value: string) => {
    if (!value) return "La contraseña es requerida.";
    return "";
  };

  const decodeBase64Url = (value: string) => {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);

    const bufferCtor = (globalThis as unknown as { Buffer?: any }).Buffer;
    if (bufferCtor?.from) {
      const bytes = Uint8Array.from(bufferCtor.from(padded, "base64"));
      const decoder = (globalThis as unknown as { TextDecoder?: any })
        .TextDecoder;
      if (decoder) {
        return new decoder("utf-8").decode(bytes);
      }
      let binary = "";
      for (const b of bytes) binary += String.fromCharCode(b);
      return decodeURIComponent(
        binary
          .split("")
          .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
          .join(""),
      );
    }

    const atobFn = (globalThis as unknown as { atob?: (s: string) => string })
      .atob;
    if (atobFn) {
      const binary = atobFn(padded);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }
      const decoder = (globalThis as unknown as { TextDecoder?: any })
        .TextDecoder;
      if (decoder) {
        return new decoder("utf-8").decode(bytes);
      }
      return decodeURIComponent(
        binary
          .split("")
          .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
          .join(""),
      );
    }

    throw new Error("Base64 decode not available");
  };

  const getJwtPayload = (token: string) => {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    try {
      const json = decodeBase64Url(parts[1]!);
      return JSON.parse(json) as Record<string, unknown>;
    } catch {
      return null;
    }
  };

  const persistAccessToken = async (token: string) => {
    (globalThis as any).__SESAMO_ACCESS_TOKEN__ = token;
    const payload = getJwtPayload(token);
    (globalThis as any).__SESAMO_JWT_PAYLOAD__ = payload;

    if (process.env.EXPO_OS === "web") {
      try {
        (globalThis as any).localStorage?.setItem(ACCESS_TOKEN_KEY, token);
      } catch {
        return;
      }
      return;
    }

    try {
      const available = await SecureStore.isAvailableAsync();
      if (!available) return;
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });
    } catch {
      return;
    }
  };

  const validateEmail = (text: string) => {
    setEmail(text);
    setEmailError(getEmailError(text));
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    setPasswordError(getPasswordError(text));
  };

  const handleLogin = async () => {
    const nextEmailError = getEmailError(email);
    const nextPasswordError = getPasswordError(password);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    if (nextEmailError || nextPasswordError) {
      return;
    }

    setIsLoading(true);
    setGeneralError("");

    try {
      const emailValue = email.trim();
      const jsonResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailValue, password }),
      });

      const parseErrorMessage = async (response: Response) => {
        const data = (await response.json().catch(() => null)) as {
          detail?: string | { msg?: string }[];
        } | null;
        if (typeof data?.detail === "string") return data.detail;
        if (Array.isArray(data?.detail) && data?.detail?.[0]?.msg)
          return data.detail[0].msg;
        if (response.status === 401)
          return "Credenciales incorrectas. Intenta nuevamente.";
        return "No se pudo iniciar sesión. Intenta nuevamente.";
      };

      const handleLoginSuccess = async (payload: unknown) => {
        const record = payload as Record<string, unknown> | null;
        const token = record?.access_token as string | undefined;

        if (!token) {
          setGeneralError("Respuesta inválida del servidor (token faltante).");
          return;
        }

        await persistAccessToken(token);

        const jwtPayload = getJwtPayload(token);
        const roleId = jwtPayload?.role_id;

        if (roleId === 1 || roleId === "1") {
          router.replace("/admin");
          return;
        }

        if (roleId === 2 || roleId === "2") {
          router.replace("/(tabs)");
          return;
        }

        setGeneralError("Tu usuario no tiene un rol válido para acceder.");
      };

      if (jsonResponse.ok) {
        const data = (await jsonResponse.json().catch(() => null)) as unknown;
        await handleLoginSuccess(data);
        return;
      }

      if (jsonResponse.status === 400 || jsonResponse.status === 422) {
        const formBody = `username=${encodeURIComponent(
          emailValue,
        )}&password=${encodeURIComponent(password)}`;
        const formResponse = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formBody,
        });

        if (formResponse.ok) {
          const data = (await formResponse.json().catch(() => null)) as unknown;
          await handleLoginSuccess(data);
          return;
        }

        setGeneralError(await parseErrorMessage(formResponse));
        return;
      }

      setGeneralError(await parseErrorMessage(jsonResponse));
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
              Bienvenido a Sésamo
            </AppText>
            <AppText variant="body" colorName="secondary">
              Inicia sesión para continuar tu aprendizaje.
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
                Correo Electrónico
              </AppText>
              <AppInput
                placeholder="ejemplo@correo.com"
                value={email}
                onChangeText={validateEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                accessibilityLabel="Campo de correo electrónico"
                accessibilityHint="Ingresa tu correo registrado"
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
                Contraseña
              </AppText>
              <AppInput
                placeholder="********"
                value={password}
                onChangeText={validatePassword}
                secureTextEntry
                accessibilityLabel="Campo de contraseña"
                accessibilityHint="Ingresa tu contraseña"
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

            <View style={{ alignItems: "flex-end" }}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Recuperar contraseña"
              >
                <AppText variant="label" colorName="primary">
                  ¿Olvidaste tu contraseña?
                </AppText>
              </Pressable>
            </View>
          </View>

          <View style={{ marginTop: 32, gap: 16 }}>
            <AppButton
              onPress={handleLogin}
              disabled={
                isLoading ||
                !!emailError ||
                !!passwordError ||
                !email ||
                !password
              }
              accessibilityLabel="Botón de Iniciar Sesión"
            >
              {isLoading ? "Cargando..." : "Iniciar Sesión"}
            </AppButton>

            <View
              style={{ flexDirection: "row", justifyContent: "center", gap: 4 }}
            >
              <AppText variant="body">¿No tienes cuenta?</AppText>
              <Pressable
                onPress={() => router.push("/auth/register")}
                accessibilityRole="button"
                accessibilityLabel="Ir a registro"
              >
                <AppText variant="bodyStrong" colorName="primary">
                  Regístrate
                </AppText>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}
