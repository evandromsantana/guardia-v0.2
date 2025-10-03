import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import { COLORS } from "../../constants";

type ButtonVariant = "primary" | "action" | "alert";

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  small?: boolean;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled,
  small,
}: ButtonProps) {
  const buttonStyle: ViewStyle[] = [styles.button, styles[variant]];
  const textStyle: TextStyle[] = [styles.text, styles[`${variant}Text`]];

  if (small) {
    buttonStyle.push(styles.smallButton);
    textStyle.push(styles.smallText);
  }

  if (disabled) {
    buttonStyle.push(styles.disabled);
  }

  return (
    <Pressable style={buttonStyle} onPress={onPress} disabled={disabled}>
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 0,
  },
  smallText: {
    fontSize: 14,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  primaryText: {
    color: COLORS.white,
  },
  action: {
    backgroundColor: COLORS.info,
  },
  actionText: {
    color: COLORS.white,
  },
  alert: {
    backgroundColor: COLORS.danger,
  },
  alertText: {
    color: COLORS.white,
  },
  disabled: {
    backgroundColor: COLORS.gray,
  },
});
