import { api } from "./client";

export const uploadFile = (formData: FormData, groupId: number) => {
  return api.post(`/admin/file/group/${groupId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteFile = (fileId: number, groupId: number) => {
  return api.delete(`/admin/group/${groupId}/files/${fileId}`);
};

export const getAllFiles = () => {
  return api.get("/admin/files");
};

export const updateFile = (fileId: number, data: any) => {
  return api.put(`/admin/file/${fileId}`, data);
};

export const getAllGroupUsers = (groupId: number) => {
  return api.get(`/admin/group/users/${groupId}`);
};

export const deleteGroup = (groupId: number) => {
  return api.delete(`/admin/group/${groupId}`);
};

export const removeUserFromGroup = (groupId: number, userId: number) => {
  return api.delete(`/admin/group/${userId}/${groupId}`);
};

export const getAllCreatedGroups = () => {
  return api.get(`/admin/group`);
};
