import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import React from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { COLORS } from "../../../constants";
import { useAuth } from "../../../hooks/useAuth";

const WelcomeButtons: React.FC = () => {
  const { signInWithGoogle, isSigningInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google Sign-In Error in component:", error);
      Alert.alert(
        "Erro no Login",
        "Não foi possível fazer o login com o Google. Por favor, verifique sua conexão e tente novamente."
      );
    }
  };

  return (
    <View style={styles.container}>
      {isSigningInWithGoogle ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <GoogleSigninButton
          style={styles.googleButton}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={handleGoogleSignIn}
          disabled={isSigningInWithGoogle}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  googleButton: {
    width: "100%",
    height: 50,
  },
});

export default WelcomeButtons;
