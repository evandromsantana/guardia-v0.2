import { COLORS } from "@/constants";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
// import { theme } from '@/constants/theme'

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  disabled?: boolean;
}

export function Input({ label, error, style, disabled, ...props }: InputProps) {
  const inputStyles = [
    styles.input,
    error ? styles.inputError : null,
    disabled ? styles.disabled : null,
    style,
  ];

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={inputStyles}
        placeholderTextColor={COLORS.gray}
        editable={!disabled}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 8,
  },
  label: {
    color: COLORS.grayDark,
    marginBottom: 4,
    fontSize: 14,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  inputError: {
    borderColor: COLORS.black,
  },
  disabled: {
    backgroundColor: COLORS.grayLight,
  },
  errorText: {
    color: COLORS.accent,
    marginTop: 4,
    fontSize: 12,
  },
});
