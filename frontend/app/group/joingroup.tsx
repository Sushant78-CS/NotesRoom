import { joinGroup } from "@/api/user";
import { darkTheme, lightTheme } from "@/constants/theme";
import { useThemeStore } from "@/store/themeStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const JoinGroupPage = () => {
  const mode = useThemeStore();
  const { background, text, card, primary, modalBg } =
    mode.theme === "dark" ? darkTheme : lightTheme;
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleJoinGroup = async () => {
    if (!inviteCode.trim()) {
      Alert.alert("Error", "Please enter invite code");
      return;
    }
    try {
      setLoading(true);
      const res = await joinGroup(inviteCode);
      console.log("response of join group : ", res.data);
      setInviteCode("");
      router.replace(`/group/${res.data.id}`);
    } catch (error: any) {
      console.log("error in join group api : ", error.response.data);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: background,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        <View
          style={{
            width: "100%",
            backgroundColor: card,
            paddingVertical: 32,
            paddingHorizontal: 24,
            borderRadius: 24,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 6,
          }}
        >
          <ActivityIndicator size="large" color={primary} />

          <Text
            style={{
              marginTop: 18,
              fontSize: 18,
              fontWeight: "700",
              color: text,
            }}
          >
            Joining Group
          </Text>

          <Text
            style={{
              marginTop: 8,
              fontSize: 14,
              color: text,
              opacity: 0.6,
              textAlign: "center",
              lineHeight: 22,
            }}
          >
            Please wait while we add you to the group...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: background }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
        >
          <View style={[styles.card, { backgroundColor: modalBg }]}>
            <View style={styles.iconContainer}>
              <Ionicons name="people" size={40} color="#4F46E5" />
            </View>

            <Text style={[styles.title, { color: text }]}>Join Group</Text>

            <Text style={[styles.subtitle, { color: text }]}>
              Enter the invite code shared by your friend or team admin to join
              the group.
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons name="key-outline" size={22} color="#777" />

              <TextInput
                placeholder="Enter invite code"
                placeholderTextColor="#000"
                value={inviteCode}
                onChangeText={setInviteCode}
                autoCapitalize="none"
                style={[styles.input]}
              />
            </View>

            <Pressable
              style={[styles.button, { backgroundColor: primary }]}
              onPress={handleJoinGroup}
            >
              <Text style={[styles.buttonText, { color: text }]}>Join Now</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default JoinGroupPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
    marginBottom: 30,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 58,
    marginBottom: 24,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#111827",
  },

  button: {
    backgroundColor: "#4F46E5",
    height: 58,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
});
