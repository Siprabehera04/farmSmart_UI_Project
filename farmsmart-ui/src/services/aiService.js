import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API with the key from environment variables (assuming Vite setup)
// The user will need to add VITE_GEMINI_API_KEY to their .env file
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let genAI = null;

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

const MODEL_CANDIDATES = [
  "gemini-2.5-flash",
  "gemini-2.0-flash-001",
  "gemini-2.0-flash",
  "gemini-2.5-flash-lite"
];

const isModelNotFoundError = (error) => {
  const message = String(error?.message || "").toLowerCase();
  return (
    message.includes("is not found") ||
    message.includes("not supported for generatecontent") ||
    message.includes("unsupported") ||
    message.includes("404")
  );
};

const formatGeminiError = (error) => {
  const message = String(error?.message || "");
  const lower = message.toLowerCase();

  if (lower.includes("api key was reported as leaked")) {
    return new Error("Gemini API key is blocked (reported leaked). Generate a new key and update VITE_GEMINI_API_KEY in .env, then restart the app.");
  }

  if (lower.includes("[403")) {
    return new Error("Gemini request was denied (403). Check API key validity, billing, and API permissions.");
  }

  if (lower.includes("[429") || lower.includes("quota")) {
    return new Error("Gemini quota/rate limit reached. Please retry after some time.");
  }

  return error;
};

const generateWithFallbackModels = async (promptOrParts) => {
  let lastError = null;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(promptOrParts);
      return result;
    } catch (error) {
      if (!isModelNotFoundError(error)) {
        throw error;
      }
      lastError = error;
      console.warn(`Model "${modelName}" unavailable, trying fallback model...`);
    }
  }

  throw lastError || new Error("No compatible Gemini model is available for generateContent.");
};

const parseJsonFromModelText = (rawText) => {
  if (!rawText) return null;

  let text = rawText.trim();
  if (text.startsWith("```json")) text = text.substring(7);
  if (text.startsWith("```")) text = text.substring(3);
  if (text.endsWith("```")) text = text.substring(0, text.length - 3);
  text = text.trim();

  try {
    return JSON.parse(text);
  } catch (_) {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const sliced = text.slice(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(sliced);
      } catch (_) {
        return null;
      }
    }
    return null;
  }
};

const normalizeHealthResult = (parsed, rawText = "") => {
  const safeText = String(rawText || "").trim();
  const obj = parsed && typeof parsed === "object" ? parsed : {};
  const treatment = Array.isArray(obj.treatment)
    ? obj.treatment.filter(Boolean)
    : [];

  return {
    diagnosis: obj.diagnosis || "Uncertain",
    severity: obj.severity || "Medium",
    confidence: obj.confidence || "70%",
    symptoms: obj.symptoms || (safeText ? safeText.slice(0, 220) : "Symptoms could not be extracted clearly from this image."),
    treatment: treatment.length ? treatment : [
      "Retake a closer, well-lit photo focused on the affected leaf area.",
      "Inspect nearby leaves for similar spots and remove severely affected ones.",
      "Consult local agri expert for crop-specific spray guidance after confirmation."
    ],
    localizedDiagnosis: obj.localizedDiagnosis || obj.diagnosis || "Unknown"
  };
};

export const getCropRecommendation = async (stateLocation, district, pincode, landSize, soilType, sowingMonth) => {
  if (!genAI) {
    throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  const prompt = `
    You are an expert agricultural AI assistant.
    Given the following details about a farmer's land:
    - State/Region: ${stateLocation}
    - District: ${district}
    - Pincode: ${pincode}
    - Land Size: ${landSize} acres
    - Soil Type: ${soilType}
    - Planned Sowing Month: ${sowingMonth}

    Analyze typical climatic conditions for this specific region/district and soil type during the ${sowingMonth} season. Then recommend the top 3 most profitable and suitable crops. The first one should be the absolute best recommendation.
    
    Return the output strictly as a single JSON object (without any markdown formatting like \`\`\`json). The JSON object must contain exactly two keys: "recommendations" and "localDealers".
    
    1. "recommendations": An array of 3 objects, each having the following string properties:
       - crop: The name of the recommended crop in English.
       - logic: A short, simple, 1-sentence explanation of why it is suitable in English.
       - confidence: A percentage (like "94%").
       - profit: An estimated profit margin per acre in Indian Rupees (INR) as a range (e.g., "₹40,000 - ₹50,000 / Acre").
       - nativeLanguage: The predominant native/regional language spoken in the requested State/Region (e.g., "Punjabi", "Odia", "Marathi").
       - nativeCrop: The name of the crop translated to that nativeLanguage.
       - nativeLogic: The logic sentence translated to that nativeLanguage.
       - nativeProfit: The profit margin translated/localized to that nativeLanguage.
       
    2. "localDealers": An array of 3 objects representing real or highly realistic agricultural seed/fertilizer markets, APMCs, or dealers in or near the requested District/Pincode. Each object must have:
       - id: A unique string ID (e.g., "dealer_1").
       - name: Name of the real dealer, APMC, or market in English.
       - distance: An estimated realistic distance string (e.g., "4.2 KM").
       - rating: A realistic star rating string out of 5 (e.g., "4.5").
  `;

  try {
    const result = await generateWithFallbackModels(prompt);
    const response = await result.response;
    const text = response.text();
    
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.substring(7);
    }
    if (cleanText.startsWith('```')) {
        cleanText = cleanText.substring(3);
    }
    if (cleanText.endsWith('```')) {
      cleanText = cleanText.substring(0, cleanText.length - 3);
    }
    
    const parsedData = JSON.parse(cleanText.trim());
    // Ensure we handle legacy arrays if AI messes up, or the new object structure
    if (Array.isArray(parsedData)) {
      return { recommendations: parsedData, localDealers: [] };
    }
    return parsedData;
  } catch (error) {
    console.error("Error generating recommendation:", error);
    throw formatGeminiError(error);
  }
};

export const detectSoilFromImage = async (base64Data, mimeType) => {
  if (!genAI) {
    throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  const prompt = `
    You are an expert agronomist. 
    Analyze this image of soil and determine its primary soil type based on visual characteristics (color, clumping, texture).
    You MUST return ONLY a single word from this exact list:
    Loamy, Clayey, Sandy, Silty, Peaty, Chalky
    Do not add any other text, punctuation, or explanation. Just the exact word.
  `;

  const imageParts = [
    {
      inlineData: {
        data: base64Data,
        mimeType
      }
    }
  ];

  try {
    const result = await generateWithFallbackModels([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text().trim();
    
    // Ensure it strictly matches one of our expected types
    const validTypes = ["Loamy", "Clayey", "Sandy", "Silty", "Peaty", "Chalky"];
    const matchedType = validTypes.find(t => text.toLowerCase().includes(t.toLowerCase()));
    
    return matchedType || "Loamy"; // Safe fallback
  } catch (error) {
    console.error("Error detecting soil from image:", error);
    throw formatGeminiError(error);
  }
};

export const analyzeCropHealth = async (base64Data, mimeType) => {
  if (!genAI) {
    throw new Error("Gemini API Key is missing.");
  }

  const prompt = `
    You are an expert plant pathologist. 
    Analyze this photo of a crop/leaf and provide a health diagnosis.
    Return your result strictly as a JSON object (no markdown) with these keys:
    - diagnosis: Clear name of the disease, pest, or deficiency (or "Healthy").
    - severity: One word: Low, Medium, or High.
    - confidence: Percentage (e.g. "92%").
    - symptoms: A short 1-sentence description of what you see.
    - treatment: A JSON array of 3 actionable steps for the farmer to take.
    - localizedDiagnosis: The diagnosis name translated to the most likely local language (e.g. Hindi/Odia).
  `;

  const imageParts = [{ inlineData: { data: base64Data, mimeType } }];

  try {
    const result = await generateWithFallbackModels([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text().trim();
    const parsed = parseJsonFromModelText(text);
    return normalizeHealthResult(parsed, text);
  } catch (error) {
    console.error("Health Scan Error:", error);
    throw formatGeminiError(error);
  }
};
