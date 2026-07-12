import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export const fetchMessages = async () => {
  const response = await api.get("/messages");
  return response.data.messages;
};

export const sendMessage = async (messageData) => {
  const response = await api.post("/messages", messageData);
  return response.data.message;
};

export default api;