// src/components/IconSymbol.tsx

// Fallback para Android e Web usando MaterialIcons
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight } from "expo-symbols";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

/**
 * Definição do mapeamento de ícones
 */
const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
} as const;

/**
 * Tipagem do nome do ícone (apenas chaves do MAPPING)
 */
type IconSymbolName = keyof typeof MAPPING;

/**
 * Props do componente
 */
interface IconSymbolProps {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight; // caso você use no futuro em iOS
}

/**
 * Componente de Ícone unificado
 */
export function IconSymbol({ name, size = 24, color, style }: IconSymbolProps) {
  return (
    <MaterialIcons
      name={MAPPING[name]}
      size={size}
      color={color}
      style={style}
    />
  );
}
