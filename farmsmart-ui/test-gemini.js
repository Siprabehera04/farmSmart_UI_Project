import { GoogleGenerativeAI } from '@google/generative-ai';

async function run() {
  const apiKey = "AIzaSyC0BqsaEzxSFbfSA9K3HZQCyRHf2uWgFb4";
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
  try {
    const result = await model.generateContent("Hello?");
    const response = await result.response;
    console.log("Success gemini-flash-latest! ", response.text());
  } catch (error) {
    console.error("ERROR gemini-flash-latest:", error.message);
  }
}

run();
