import { useState } from "react";
import {
  KeyboardAvoidingView,
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

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const errorColor = useThemeColor({}, "error");

  const validateEmail = (text: string) => {
    setEmail(text);
    if (!text) {
      setEmailError("El correo es requerido.");
    } else if (!/^\S+@\S+\.\S+$/.test(text)) {
      setEmailError("Formato de correo inválido.");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    if (!text) {
      setPasswordError("La contraseña es requerida.");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = () => {
    validateEmail(email);
    validatePassword(password);

    if (emailError || passwordError || !email || !password) {
      return;
    }

    setIsLoading(true);
    setGeneralError("");

    // Mock Authentication Logic
    setTimeout(() => {
      setIsLoading(false);
      if (email === "admin@sesamo.com" && password === "admin123") {
        router.replace("/admin");
      } else if (
        email === "student@sesamo.com" &&
        password === "student123"
      ) {
        router.replace("/(tabs)");
      } else {
        setGeneralError("Credenciales incorrectas. Intenta nuevamente.");
      }
    }, 1500);
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
