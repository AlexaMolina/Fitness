require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

// Importar rutas
const userRoutes = require("./routes/UserRoutes");
const recommendationRoutes = require("./routes/RecommendationRoutes");
const paymentRoutes = require("./routes/PaymentRoutes");
const exerciseRoutes = require("./routes/ExercisesRoutes");
const ResultsRoutes = require("./routes/ResultsRoutes");

const app = express();

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conexión a MongoDB exitosa"))
  .catch((err) => {
    console.error("Error al conectar con MongoDB:", err.message);
    process.exit(1);
  });

mongoose.connection.on("connected", () => {
  console.log("Mongoose conectado a la base de datos");
});

mongoose.connection.on("error", (err) => {
  console.error("Error en la conexión a MongoDB:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose desconectado de la base de datos");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Conexión a MongoDB cerrada debido a la terminación del proceso");
  process.exit(0);
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de rutas
app.use("/api/users", userRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/results", ResultsRoutes);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔥 **Ruta del chat con la IA** 🔥
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "El mensaje no puede estar vacío." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Eres un entrenador de fitness experto. Solo responderás preguntas sobre fitness, salud, nutrición y ejercicio. Si alguien te pregunta sobre otro tema, responde con: 'Solo puedo responder sobre temas de fitness y salud. ¿Tienes alguna otra pregunta relacionada?'",
        },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    res.json({ reply: completion.choices[0].message.content.trim() });
  } catch (error) {
    console.error("Error con OpenAI:", error);
    res.status(500).json({ error: "Error al obtener respuesta de la IA." });
  }
});

// Ruta de prueba (debe ir antes del manejo de rutas no encontradas)
app.get("/test", (req, res) => {
  res.json({ message: "Servidor activo" });
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error("Error general:", err.stack || err);
  res
    .status(500)
    .json({ error: "Error interno del servidor", details: err.message });
});

// Inicia el servidor
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
