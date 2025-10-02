
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

const BIOMETRICS_ENABLED_KEY = 'biometrics_enabled';

/**
 * Checks if biometrics are enabled in SecureStore.
 */
export const isBiometricsEnabled = async (): Promise<boolean> => {
  const enabled = await SecureStore.getItemAsync(BIOMETRICS_ENABLED_KEY);
  return enabled === 'true';
};

/**
 * Disables biometrics by removing the key from SecureStore.
 */
export const disableBiometrics = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(BIOMETRICS_ENABLED_KEY);
};

/**
 * Checks for hardware support and user enrollment, then prompts the user
 * to enable biometric authentication for future logins.
 */
export const promptToEnableBiometrics = async (): Promise<void> => {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) return;

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) return;

    const alreadyEnabled = await isBiometricsEnabled();
    if (alreadyEnabled) return;

    Alert.alert(
      'Login Rápido',
      'Deseja habilitar o login por biometria (digital/facial) para seus próximos acessos?',
      [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim, Habilitar',
          onPress: async () => {
            await SecureStore.setItemAsync(BIOMETRICS_ENABLED_KEY, 'true');
            Alert.alert('Biometria Habilitada!', 'Você já pode usar a biometria no seu próximo login.');
          },
        },
      ]
    );
  } catch (error) {
    console.error('Error enabling biometrics', error);
  }
};

/**
 * Triggers the biometric authentication prompt.
 * @returns A promise that resolves to the authentication result.
 */
export const authenticateWithBiometrics = async (): Promise<LocalAuthentication.LocalAuthenticationResult> => {
  return await LocalAuthentication.authenticateAsync({
    promptMessage: 'Faça login no Guardiã',
    cancelLabel: 'Usar senha',
    fallbackLabel: 'Use o código do seu aparelho',
  });
};
