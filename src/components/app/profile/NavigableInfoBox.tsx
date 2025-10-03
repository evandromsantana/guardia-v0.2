import React from "react";
import { TouchableOpacity } from "react-native";
import { ProfileInfoBox } from "./";

interface NavigableInfoBoxProps {
  title: string;
  content: string;
  onPress: () => void;
}

export const NavigableInfoBox: React.FC<NavigableInfoBoxProps> = ({
  title,
  content,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <ProfileInfoBox title={title} content={content} />
    </TouchableOpacity>
  );
};
