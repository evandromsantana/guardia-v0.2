import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { ExternalLink } from "../external-link";
import { MonoText } from "./StyledText";

export default function EditScreenInfo({ path }: { path: string }) {
  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Text style={styles.getStartedText}>Abra o código para esta tela:</Text>

        <View
          style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
          <MonoText>{path}</MonoText>
        </View>

        <Text style={styles.getStartedText}>
          Altere qualquer texto no editor e salve-o para recarregar seu
          aplicativo.
        </Text>
      </View>

      <View style={styles.helpContainer}>
        <ExternalLink
          style={styles.helpLink}
          href="https://docs.expo.io/get-started/create-a-new-app/#tab-and-stack-navigator">
          <Text style={styles.helpLinkText}>
            Toque aqui se o seu aplicativo não atualizar automaticamente após
            fazer alterações
          </Text>
        </ExternalLink>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
    paddingHorizontal: 4,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: "center",
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: "center",
  },
});
