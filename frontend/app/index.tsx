import { useAuth } from "@/hook/useAuth";
import { useThemeStore } from "@/store/themeStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { darkTheme, lightTheme } from "../constants/theme";

export default function Index() {
  const router = useRouter();
  const mode = useThemeStore((s) => s.theme);
  const { background, text, card, primary } =
    mode === "dark" ? darkTheme : lightTheme;

  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  const [loading, setLoading] = useState<boolean>(false);

  const { user, logout } = useAuth();

  const handleLogOut = () => {
    setLoading(true);
    try {
      logout();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[
        styles.container,
        {
          backgroundColor: background,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        <View
          style={[
            styles.headerCard,
            {
              backgroundColor: primary,
            },
          ]}
        >
          <View style={styles.overlayCircle} />

          <View style={styles.profileSection}>
            <View
              style={[
                styles.avatarContainer,
                {
                  backgroundColor: "rgba(255,255,255,0.18)",
                },
              ]}
            >
              <Text style={styles.avatarText}>
                {user?.username?.charAt(0)?.toUpperCase()}
              </Text>
            </View>

            <Text style={styles.userName}>{user?.username}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: text,
              },
            ]}
          >
            Account
          </Text>

          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: card,
              },
            ]}
          >
            <View style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <Ionicons name="person-outline" size={20} color={primary} />

                <Text
                  style={[
                    styles.infoLabel,
                    {
                      color: text,
                    },
                  ]}
                >
                  Username
                </Text>
              </View>

              <Text
                style={[
                  styles.infoValue,
                  {
                    color: text,
                  },
                ]}
              >
                {user?.username}
              </Text>
            </View>

            <View
              style={[
                styles.divider,
                {
                  backgroundColor:
                    mode === "dark" ? "rgba(255,255,255,0.06)" : "#ECECEC",
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: text,
              },
            ]}
          >
            Preferences
          </Text>

          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: card,
              },
            ]}
          >
            <View style={styles.themeRow}>
              <View style={styles.infoLeft}>
                <Ionicons
                  name={mode === "dark" ? "moon-outline" : "sunny-outline"}
                  size={20}
                  color={primary}
                />

                <Text
                  style={[
                    styles.infoLabel,
                    {
                      color: text,
                    },
                  ]}
                >
                  Dark Mode
                </Text>
              </View>

              <Switch
                value={mode === "dark"}
                onValueChange={toggleTheme}
                trackColor={{
                  false: "#ccc",
                  true: primary,
                }}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.logoutButton,
            {
              backgroundColor: "#ef4444",
            },
          ]}
          onPress={handleLogOut}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />

          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerCard: {
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    paddingTop: 30,
    paddingBottom: 40,
    alignItems: "center",
    overflow: "hidden",
  },

  overlayCircle: {
    position: "absolute",
    top: -50,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  profileSection: {
    alignItems: "center",
  },

  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "700",
  },

  userName: {
    marginTop: 18,
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },

  userRole: {
    marginTop: 6,
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },

  section: {
    marginTop: 26,
    paddingHorizontal: 18,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },

  infoCard: {
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },

  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoLabel: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "500",
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "600",
  },

  divider: {
    height: 1,
  },

  themeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },

  logoutButton: {
    marginTop: 34,
    marginHorizontal: 18,
    height: 58,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },
});
