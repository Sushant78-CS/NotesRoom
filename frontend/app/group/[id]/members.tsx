import { getGroupDetail, getMembersInGroup } from "@/api/user";
import { darkTheme, lightTheme } from "@/constants/theme";
import { useAuth } from "@/hook/useAuth";
import { useThemeStore } from "@/store/themeStore";
import { GroupDetail, GroupMember } from "@/types/groupTypes";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GroupDetailPage = () => {
  const mode = useThemeStore((s) => s.theme);
  const { background, text, card, primary, modalBg } =
    mode === "dark" ? darkTheme : lightTheme;
  const router = useRouter();
  const { id: groupId } = useLocalSearchParams();
  const { user } = useAuth();

  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [groupDetail, setGroupDetail] = useState<GroupDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const currentUsername = user?.username;

  const isAdmin = groupMembers?.some(
    (member) =>
      member.username === currentUsername && member.role === "ROLE_ADMIN",
  );

  useEffect(() => {
    console.log("groupId", groupId);
    fetchGroupMembers(Number(groupId));
    fetchGroupDetail(Number(groupId));
  }, []);

  const fetchGroupMembers = async (groupId: number) => {
    try {
      setLoading(true);

      const res = await getMembersInGroup(groupId);

      setGroupMembers(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupDetail = async (groupId: number) => {
    try {
      setLoading(true);

      const res = await getGroupDetail(groupId);

      setGroupDetail(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(groupDetail?.inviteCode || "");
    ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
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
      <View
        style={[
          styles.headerCard,
          {
            backgroundColor: primary,
          },
        ]}
      >
        <View style={styles.headerOverlay} />

        <View style={styles.headerContent}>
          <View>
            <Text style={styles.pageTitle}>Members</Text>
            <Text style={styles.pageSubtitle}>
              {isAdmin ? "Manage and view group members" : "View members"}
            </Text>
            <View style={styles.codeContainer}>
              <Text style={styles.codeLabel}>Group Code</Text>

              <View
                style={[
                  styles.codeBox,
                  {
                    backgroundColor: modalBg,
                  },
                ]}
              >
                {loading ? (
                  <ActivityIndicator color={text} size="small" />
                ) : groupDetail?.inviteCode ? (
                  <Text style={[styles.codeText, { color: text }]}>
                    {groupDetail?.inviteCode}
                  </Text>
                ) : (
                  <Text style={[styles.codeText, { color: text }]}>N/A</Text>
                )}

                {!loading && groupDetail?.inviteCode && (
                  <Pressable onPress={handleCopyCode} style={styles.copyButton}>
                    <Ionicons name="copy-outline" size={18} color={text} />
                  </Pressable>
                )}
              </View>
            </View>
          </View>

          <View style={styles.memberCountBadge}>
            <Text style={styles.memberCountText}>
              {groupDetail?.memberCount || 0}
            </Text>
          </View>
        </View>
      </View>

      {groupMembers
        ?.filter((member) => member.role === "ROLE_ADMIN")
        .map((admin) => (
          <View
            key={admin.id}
            style={[
              styles.adminCard,
              {
                backgroundColor: card,
              },
            ]}
          >
            <View
              style={[
                styles.adminAvatar,
                {
                  backgroundColor: `${primary}15`,
                },
              ]}
            >
              <Text style={styles.adminAvatarText}>
                {admin.username.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={styles.adminInfo}>
              <Text
                style={[
                  styles.adminName,
                  {
                    color: text,
                  },
                ]}
              >
                {admin.username}
              </Text>

              <View style={[styles.adminBadge, { backgroundColor: primary }]}>
                <Text style={styles.adminBadgeText}>Admin</Text>
              </View>
            </View>
          </View>
        ))}

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={groupMembers?.filter((member) => member.role !== "ROLE_ADMIN")}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 30,
          }}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.memberCard,
                {
                  backgroundColor: card,
                },
              ]}
            >
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: mode === "dark" ? "#252525" : "#F3F4F6",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.avatarText,
                    {
                      color: text,
                    },
                  ]}
                >
                  {item.username.charAt(0).toUpperCase()}
                </Text>
              </View>

              <View style={styles.memberInfo}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.memberName,
                    {
                      color: text,
                    },
                  ]}
                >
                  {item.username}
                </Text>

                <Text
                  style={[
                    styles.memberRole,
                    {
                      color: text,
                      opacity: 0.5,
                    },
                  ]}
                >
                  Member
                </Text>
              </View>

              <View
                style={[
                  styles.memberIndexBadge,
                  {
                    backgroundColor: mode === "dark" ? "#202020" : "#F5F5F5",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.memberIndexText,
                    {
                      color: text,
                    },
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};
export default GroupDetailPage;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
  },

  codeContainer: {
    marginTop: 12,
  },

  codeLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.75)",
    marginBottom: 8,
    letterSpacing: 0.3,
  },

  codeBox: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    paddingVertical: 4,
    gap: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },

  codeText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1.2,
  },

  copyButton: {
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  headerCard: {
    borderRadius: 28,
    overflow: "hidden",
    padding: 22,
    marginBottom: 22,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },

  headerOverlay: {
    position: "absolute",
    top: -40,
    right: -20,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  pageTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "700",
  },

  pageSubtitle: {
    marginTop: 6,
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    lineHeight: 20,
  },

  memberCountBadge: {
    minWidth: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.16)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  memberCountText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  adminCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 22,
    marginBottom: 18,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  adminAvatar: {
    width: 62,
    height: 62,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  adminAvatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },

  adminInfo: {
    flex: 1,
    marginLeft: 16,
  },

  adminName: {
    fontSize: 17,
    fontWeight: "700",
  },

  adminBadge: {
    marginTop: 8,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
    textAlign: "center",
  },

  adminBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    marginBottom: 14,
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 20,
    fontWeight: "700",
  },

  memberInfo: {
    flex: 1,
    marginLeft: 14,
  },

  memberName: {
    fontSize: 16,
    fontWeight: "600",
  },

  memberRole: {
    marginTop: 4,
    fontSize: 13,
  },

  memberIndexBadge: {
    minWidth: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  memberIndexText: {
    fontSize: 13,
    fontWeight: "700",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  topSection: {
    marginTop: 14,
    marginBottom: 28,
  },

  memberCount: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "400",
  },

  adminLabel: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
});
