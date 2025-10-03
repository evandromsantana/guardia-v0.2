import { StyleSheet, View, ViewProps } from "react-native";
import { COLORS } from "../../constants";

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
}

export function Container({ children, style, ...props }: ContainerProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});
