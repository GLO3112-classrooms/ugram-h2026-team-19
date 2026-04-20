import { io } from "socket.io-client";

const token = "JWT_TOKEN";
const socket = io("http://localhost:3000/messages", {
  auth: { token: token },
});

socket.on("connect", () => {
  console.log("✅ Connected to Gateway! ID:", socket.id);
});

socket.on("newMessage", (data) => {
  console.log("📩 New Message Received:", data);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection Error:", err.message);
});
