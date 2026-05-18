import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

async function run() {
  const apiKey = "AIzaSyC0BqsaEzxSFbfSA9K3HZQCyRHf2uWgFb4";
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    fs.writeFileSync('models_list.json', JSON.stringify(data, null, 2));
    const modelNames = data.models.map(m => m.name);
    console.log(modelNames.filter(n => n.includes("1.5")).join("\n"));
  } catch(e) {
    console.error(e);
  }
}

run();
