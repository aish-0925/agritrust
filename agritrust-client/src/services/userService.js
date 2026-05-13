import api from "./api";

/* Get Profile */
export const getProfile = async () => {
  const res = await api.get("/users/profile");
  return res.data;
};

/* Update Profile */
export const updateProfile = async (data) => {
  const res = await api.put("/users/profile", data);
  return res.data;
};

/* Upload Avatar */
export const uploadAvatar = async (formData) => {
  const res = await api.post("/users/upload-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return res.data;
};