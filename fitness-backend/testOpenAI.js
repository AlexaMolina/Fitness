const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testAPI() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hola, ¿puedes responder?" }],
    });
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("Error al probar OpenAI:", error);
  }
}

testAPI();
