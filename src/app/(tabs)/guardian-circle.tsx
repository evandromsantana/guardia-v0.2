import * as Contacts from "expo-contacts";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ZodError } from "zod";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import {
  useAcceptGuardianRequest,
  useGuardians,
  useInviteGuardian,
  usePendingGuardianRequests,
  useRejectGuardianRequest,
  useRemoveGuardian,
} from "../../components/hooks/guardian";
import { Container } from "../../components/layout/Container";
import { COLORS } from "../../constants";
import { useAuth } from "../../hooks/useAuth";

interface GuardianItem {
  guardianUid: string;
  fullName?: string;
  email?: string;
  status: "pending" | "accepted";
}

export default function GuardianCircleScreen() {
  const { user } = useAuth();
  const userUid = user?.uid || "";

  const {
    data: guardians,
    isLoading: isLoadingGuardians,
    isError: isErrorGuardians,
    error: errorGuardians,
  } = useGuardians(userUid);
  const {
    data: pendingRequests,
    isLoading: isLoadingPendingRequests,
    isError: isErrorPendingRequests,
    error: errorPendingRequests,
  } = usePendingGuardianRequests(userUid);

  const inviteGuardianMutation = useInviteGuardian();
  const acceptRequestMutation = useAcceptGuardianRequest();
  const rejectRequestMutation = useRejectGuardianRequest();
  const removeGuardianMutation = useRemoveGuardian();

  const [inviteePhoneNumber, setInviteePhoneNumber] = useState("");

  async function handleInviteGuardian() {
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }
    try {
      await inviteGuardianMutation.mutateAsync({
        inviterUid: user.uid,
        targetPhoneNumber: inviteePhoneNumber,
      });
      Alert.alert("Sucesso", `Convite enviado para ${inviteePhoneNumber}! `);
      setInviteePhoneNumber("");
    } catch (err: any) {
      if (err instanceof ZodError) {
        Alert.alert("Erro de validação", err.issues[0].message);
      } else {
        Alert.alert(
          "Erro",
          err.message || "Não foi possível enviar o convite."
        );
      }
    }
  }

  async function handleAcceptRequest(requestId: string) {
    if (!user) return;
    try {
      await acceptRequestMutation.mutateAsync({ requestId, userUid: user.uid });
      Alert.alert("Sucesso", "Solicitação aceita!");
    } catch (err: any) {
      Alert.alert(
        "Erro",
        err.message || "Não foi possível aceitar a solicitação."
      );
    }
  }

  async function handleRejectRequest(requestId: string) {
    if (!user) return;
    try {
      await rejectRequestMutation.mutateAsync({ requestId, userUid: user.uid });
      Alert.alert("Sucesso", "Solicitação rejeitada!");
    } catch (err: any) {
      Alert.alert(
        "Erro",
        err.message || "Não foi possível rejeitar a solicitação."
      );
    }
  }

  async function handleRemoveGuardian(guardianUidToRemove: string) {
    if (!user) return;
    try {
      await removeGuardianMutation.mutateAsync({
        userUid: user.uid,
        guardianUid: guardianUidToRemove,
      });
      Alert.alert("Sucesso", "Guardião removido.");
    } catch (err: any) {
      Alert.alert(
        "Erro",
        err.message || "Não foi possível remover o guardião."
      );
    }
  }

  const handleImportContact = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        // For simplicity, we'll just use the first phone number of the first contact
        const contact = data[0];
        if (contact.phoneNumbers && contact.phoneNumbers[0]) {
          setInviteePhoneNumber(contact.phoneNumbers[0].number || "");
        }
      }
    }
  };

  if (isLoadingGuardians || isLoadingPendingRequests) {
    return (
      <Container style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.white} />
        <Text style={styles.loadingText}>
          Carregando círculo de guardiãs...
        </Text>
      </Container>
    );
  }

  if (isErrorGuardians || isErrorPendingRequests) {
    return (
      <Container style={styles.loadingContainer}>
        <Text style={styles.errorText}>
          Erro ao carregar dados:{" "}
          {errorGuardians?.message || errorPendingRequests?.message}
        </Text>
      </Container>
    );
  }

  const renderGuardianItem = ({ item }: { item: GuardianItem }) => (
    <View style={styles.guardianItem}>
      <Text style={styles.guardianName}>
        {item.fullName || item.email || item.guardianUid}
      </Text>
      {item.status === "accepted" && (
        <Button
          title="Remover"
          onPress={() => handleRemoveGuardian(item.guardianUid)}
          variant="alert"
          disabled={removeGuardianMutation.isPending}
          small
        />
      )}
      {item.status === "pending" && (
        <View style={styles.requestActions}>
          <Button
            title="Aceitar"
            onPress={() => handleAcceptRequest(item.guardianUid)}
            variant="action"
            disabled={acceptRequestMutation.isPending}
            small
          />
          <Button
            title="Rejeitar"
            onPress={() => handleRejectRequest(item.guardianUid)}
            variant="alert"
            disabled={rejectRequestMutation.isPending}
            small
          />
        </View>
      )}
    </View>
  );

  return (
    <Container style={styles.container}>
      <Text style={styles.title}>Círculo de Guardiãs</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meus Guardiões</Text>
        {guardians && guardians.length > 0 ? (
          <FlatList
            data={guardians}
            keyExtractor={(item) => item.guardianUid}
            renderItem={renderGuardianItem}
          />
        ) : (
          <Text style={styles.noDataText}>Você ainda não tem guardiões.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Solicitações Pendentes</Text>
        {pendingRequests && pendingRequests.length > 0 ? (
          <FlatList
            data={pendingRequests}
            keyExtractor={(item) => item.guardianUid}
            renderItem={renderGuardianItem}
          />
        ) : (
          <Text style={styles.noDataText}>Nenhuma solicitação pendente.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Convidar Guardiã</Text>
        <Input
          label="Telefone da Guardiã"
          placeholder="(xx) xxxxx-xxxx"
          value={inviteePhoneNumber}
          onChangeText={setInviteePhoneNumber}
          keyboardType="phone-pad"
          autoCapitalize="none"
          disabled={inviteGuardianMutation.isPending}
        />
        <View style={styles.inviteButtons}>
          <Button
            title="Importar Contato"
            onPress={handleImportContact}
            variant="action"
          />
          <Button
            title={
              inviteGuardianMutation.isPending
                ? "Enviando..."
                : "Enviar Convite"
            }
            onPress={handleInviteGuardian}
            variant="primary"
            disabled={inviteGuardianMutation.isPending}
          />
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 20,
    textAlign: "center",
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.white,
    fontSize: 16,
  },
  errorText: {
    marginTop: 10,
    color: COLORS.white,
    fontSize: 16,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 10,
  },
  guardianItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  guardianName: {
    color: COLORS.white,
    fontSize: 16,
    flex: 1,
  },
  requestActions: {
    flexDirection: "row",
    gap: 10,
  },
  inviteButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  noDataText: {
    color: COLORS.white,
    fontSize: 14,
    textAlign: "center",
  },
});
