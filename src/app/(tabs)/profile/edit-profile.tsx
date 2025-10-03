import { COLORS } from "@/src/constants";
import { TaughtSkill, UserProfile } from "@/src/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { uploadImage } from "../../../api/cloudinary";
import ProfileImagePicker from "../../../components/app/profile/ProfileImagePicker";
import ProfileInputField from "../../../components/app/profile/ProfileInputField";
import ProfileSaveButton from "../../../components/app/profile/ProfileSaveButton";
import SkillsToTeachEditor from "../../../components/app/profile/SkillsToTeachEditor";
import { useAuth } from "../../../hooks/useAuth";
import {
  getUserProfile,
  updateUserProfile,
} from "../../../services/userService";

import { z } from "zod";

// Zod schema for profile update validation
const taughtSkillSchema = z.object({
  skillName: z
    .string()
    .trim()
    .min(1, "O nome da habilidade não pode estar vazio."),
  multiplier: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "O multiplicador deve ser um número positivo."),
});

const profileUpdateSchema = z.object({
  displayName: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  bio: z.string().optional(),
  skillsToTeach: z.array(taughtSkillSchema).optional(),
  skillsToLearn: z.string().optional(),
  imageUri: z.string().nullable().optional(),
});

interface EditableTaughtSkill {
  skillName: string;
  multiplier: string;
}

const EditProfileScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [skillsToTeach, setSkillsToTeach] = useState<EditableTaughtSkill[]>([]);
  const [skillsToLearn, setSkillsToLearn] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  // 1. Query to fetch existing profile data
  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ["userProfile", user?.uid],
    queryFn: () => getUserProfile(user!.uid),
    enabled: !!user,
  });

  // Effect to populate form when query data is loaded
  useEffect(() => {
    if (profileData) {
      setDisplayName(profileData.displayName || "");
      setBio(profileData.bio || "");
      setSkillsToTeach(
        (profileData.skillsToTeach || [])
          .filter((skill) => !!skill.skillName)
          .map((skill) => ({
            skillName: skill.skillName!,
            multiplier: String(skill.multiplier),
          }))
      );
      setSkillsToLearn(profileData.skillsToLearn?.join(", ") || "");
      setImageUri(profileData.photoUrl || null);
    }
  }, [profileData]);

  // 2. Mutation to update the profile
  const { mutate: update, isPending: isSubmitting } = useMutation({
    mutationFn: async () => {
      const validationResult = profileUpdateSchema.safeParse({
        displayName,
        bio,
        skillsToTeach,
        skillsToLearn,
        imageUri,
      });

      if (!validationResult.success) {
        throw new Error(validationResult.error.issues[0].message);
      }

      if (!user) {
        throw new Error("Usuário não autenticado.");
      }

      const skillsToSave: TaughtSkill[] = (
        validationResult.data.skillsToTeach || []
      ).map((skill) => ({
        skillName: skill.skillName,
        multiplier: parseFloat(skill.multiplier),
      }));

      let photoUrl: string | null = imageUri;
      if (imageUri && imageUri.startsWith("file://")) {
        photoUrl = await uploadImage(imageUri);
      }

      const updatedData: Partial<UserProfile> = {
        displayName: validationResult.data.displayName,
        bio: validationResult.data.bio,
        skillsToTeach: skillsToSave,
        skillsToLearn: (validationResult.data.skillsToLearn || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        photoUrl,
      };

      await updateUserProfile(user.uid, updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", user?.uid] });
      Alert.alert("Sucesso", "Perfil atualizado!");
      router.back();
    },
    onError: (error) => {
      console.error("Erro ao atualizar o perfil:", error);
      Alert.alert(
        "Erro",
        error.message || "Não foi possível atualizar o seu perfil."
      );
    },
  });

  // --- Form handlers ---
  const handleAddSkill = () =>
    setSkillsToTeach([...skillsToTeach, { skillName: "", multiplier: "1.0" }]);
  const handleRemoveSkill = (index: number) =>
    setSkillsToTeach(skillsToTeach.filter((_, i) => i !== index));
  const handleSkillChange = (
    index: number,
    field: "skillName" | "multiplier",
    value: string
  ) => {
    const updatedSkills = [...skillsToTeach];
    updatedSkills[index][field] = value;
    setSkillsToTeach(updatedSkills);
  };
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  if (isProfileLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 50 }}>
      <ProfileImagePicker imageUri={imageUri} onPickImage={handlePickImage} />
      <ProfileInputField
        label="Nome"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <ProfileInputField
        label="Sobre mim"
        value={bio}
        onChangeText={setBio}
        multiline
        textArea
      />
      <SkillsToTeachEditor
        skillsToTeach={skillsToTeach}
        onAddSkill={handleAddSkill}
        onRemoveSkill={handleRemoveSkill}
        onSkillChange={handleSkillChange}
      />
      <ProfileInputField
        label="Habilidades que quero aprender"
        placeholder="Separadas por vírgula"
        value={skillsToLearn}
        onChangeText={setSkillsToLearn}
      />
      <ProfileSaveButton isSubmitting={isSubmitting} onPress={() => update()} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background || "#f5f5f5",
  },
});

export default EditProfileScreen;
