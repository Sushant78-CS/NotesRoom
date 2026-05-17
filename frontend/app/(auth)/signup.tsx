import { signUp } from "@/api/auth";
import { saveToken, saveUser } from "@/api/storage";
import { useAuth } from "@/hook/useAuth";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      const res = await signUp({ username, password });
      setUser(res.data);
      saveUser(res.data.user);
      saveToken(res.data.accessToken, res.data.refreshToken);
      setUsername("");
      setPassword("");
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={[styles.mainContainer]}>
      <KeyboardAvoidingView
        style={[{ flex: 1 }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.container]}>
            <View style={[styles.content]}>
              <Text style={styles.title}>Create Account</Text>
            </View>
            <View style={[styles.inputContainer]}>
              <TextInput
                placeholder="username"
                style={styles.input}
                value={username}
                autoCapitalize="none"
                onChangeText={setUsername}
              />
              <TextInput
                placeholder="Password"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                secureTextEntry
              />
              <TouchableOpacity
                style={[styles.button]}
                onPress={handleSignUp}
                disabled={isLoading}
              >
                <Text style={[styles.buttonText]}>Sign Up</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.bottomSection]}>
              <Text style={styles.bottomText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.signUpText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View nativeID="clerk-captcha" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpPage;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    paddingTop: 80,
    width: "100%",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  content: {
    marginBottom: 30,
  },
  inputContainer: {
    width: "88%",
    maxWidth: 340,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#000",
    // padding: 10,
    paddingVertical: 14,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  bottomSection: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  bottomText: {
    fontSize: 16,
    color: "#4e5152ff",
  },
  signUpText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 5,
  },
  signUpLink: {
    color: "#007185",
    fontSize: 16,
    marginLeft: 6,
    fontWeight: "500",
  },
  createAccountButton: {
    marginTop: 18,
    width: 300,
    height: 45,
    borderRadius: 10,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#aaa",
    alignItems: "center",
    justifyContent: "center",
  },

  createAccountText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
  },
});
