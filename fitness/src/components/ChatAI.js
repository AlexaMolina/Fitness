import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Send } from "lucide-react";
import axios from "axios";

const ChatAI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5003/api/chat", {
        message: input,
      });

      setMessages([
        ...newMessages,
        { text: response.data.reply, sender: "bot" },
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { text: "❌ Error al obtener respuesta de la IA.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 2, height: 400, overflowY: "auto", mb: 2 }}>
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              textAlign: msg.sender === "user" ? "right" : "left",
              mb: 1,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                display: "inline-block",
                p: 1,
                borderRadius: 2,
                bgcolor: msg.sender === "user" ? "#2563eb" : "#f3f4f6",
                color: msg.sender === "user" ? "white" : "black",
              }}
            >
              {msg.text}
            </Typography>
          </Box>
        ))}
        {loading && <CircularProgress size={24} />}
      </Paper>

      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          label="Escribe tu mensaje..."
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={sendMessage}>
          <Send size={20} />
        </Button>
      </Box>
    </Box>
  );
};

export default ChatAI;
