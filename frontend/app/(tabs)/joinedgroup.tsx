import { getAllJoinedGroups } from "@/api/user";
import { darkTheme, lightTheme } from "@/constants/theme";
import { useAuth } from "@/hook/useAuth";
import { useThemeStore } from "@/store/themeStore";
import { Group } from "@/types/groupTypes";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GroupScreen = () => {
  const mode = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const { background, text, card, primary, modalBg } =
    mode === "dark" ? darkTheme : lightTheme;
  const router = useRouter();

  const { logout } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [showModal, setShowModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, []),
  );

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await getAllJoinedGroups();
      //   const res = await getAllGroups();
      setGroups(res.data);
    } catch (err: any) {
      if (err?.name !== "CanceledError") console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogOut = async () => {
    logout();
    router.replace("/login");
  };

  const handleCreateGroup = () => {
    setShowModal(true);
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: background,
        }}
      >
        <ActivityIndicator size="large" color={text} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{
        flex: 1,
        backgroundColor: background,
      }}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: background,
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: text }]}>Groups</Text>
          <View style={styles.headerContent}>
            <TouchableOpacity>
              <Ionicons name="person-circle-outline" size={28} color={text} />
            </TouchableOpacity>
            <Switch
              value={mode === "dark"}
              onValueChange={toggleTheme}
              trackColor={{ false: "#ccc", true: primary }}
              thumbColor={mode === "dark" ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>
        {groups.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={60} color="#bbb" />
            <Text style={styles.emptyText}>No groups yet</Text>
            <Text style={styles.subText}>Tap + to create your first group</Text>
          </View>
        ) : (
          <FlatList
            data={groups}
            keyExtractor={(item, index) =>
              item?.id?.toString() ?? index.toString()
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.card,
                  {
                    backgroundColor: card,
                  },
                ]}
                onPress={() =>
                  router.push({
                    pathname: "/group/[id]",
                    params: {
                      id: item?.id,
                    },
                  })
                }
              >
                <View style={styles.cardContent}>
                  <View>
                    <Text style={[styles.groupName, { color: text }]}>
                      {item?.groupName}
                    </Text>
                    <Text style={styles.groupSub}>Tap to open group</Text>
                  </View>

                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>
              </TouchableOpacity>
            )}
          />
        )}
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: primary }]}
          onPress={handleCreateGroup}
        >
          <Ionicons name="add" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={handleLogOut}
          style={{
            backgroundColor: primary,
            padding: 10,
            borderRadius: 14,
          }}
        >
          <Text>Log Out</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={showModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: modalBg }]}>
            <Text style={[styles.modalTitle, { color: text }]}>
              Choose Action
            </Text>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: primary }]}
              onPress={() => {
                router.push("/group/creategroup");
                setShowModal(false);
              }}
            >
              <Ionicons name="add-circle-outline" size={20} color="#fff" />
              <Text style={styles.modalButtonText}>Create Group</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#4CAF50" }]}
              onPress={() => {
                router.push("/group/joingroup");
                setShowModal(false);
              }}
            >
              <Ionicons name="log-in-outline" size={20} color="#fff" />
              <Text style={styles.modalButtonText}>Join Group</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default GroupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
    paddingTop: 10,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 10,
    color: "#444",
  },
  subText: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  fab: {
    position: "absolute",
    bottom: 25,
    right: 20,
    backgroundColor: "#1a73e8",
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 18,
    borderRadius: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  groupName: {
    fontSize: 18,
    fontWeight: "600",
  },

  groupSub: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    elevation: 8,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },

  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    gap: 8,
  },

  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },

  cancelButton: {
    marginTop: 10,
  },

  cancelText: {
    color: "#888",
    fontSize: 14,
  },
});
