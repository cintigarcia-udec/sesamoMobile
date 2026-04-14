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

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const errorColor = useThemeColor({}, "error");

  const validateName = (text: string) => {
    setName(text);
    if (!text) {
      setNameError("El nombre es requerido.");
    } else if (text.length < 3) {
      setNameError("El nombre debe tener al menos 3 caracteres.");
    } else {
      setNameError("");
    }
  };

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
    } else if (text.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
    } else {
      setPasswordError("");
    }
  };

  const handleRegister = () => {
    validateName(name);
    validateEmail(email);
    validatePassword(password);

    if (
      nameError ||
      emailError ||
      passwordError ||
      !name ||
      !email ||
      !password
    ) {
      return;
    }

    setIsLoading(true);
    setGeneralError("");

    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
      // Simulate successful registration
      router.replace("/(tabs)");
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
                Nombre Completo
              </AppText>
              <AppInput
                placeholder="Tu nombre"
                value={name}
                onChangeText={validateName}
                autoCapitalize="words"
                accessibilityLabel="Campo de nombre completo"
                accessibilityHint="Ingresa tu nombre y apellido"
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
                !!emailError ||
                !!passwordError ||
                !name ||
                !email ||
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
    </AppScreen>
  );
}
