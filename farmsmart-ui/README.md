# 🌿 FarmSmart AI - Premium Agricultural Intelligence

**FarmSmart AI** is a professional-grade, nature-inspired agricultural dashboard designed to empower farmers with cutting-edge AI insights. Built for high accessibility, it bridges the gap between complex data and practical farming through a visually stunning interface and multimodal AI capabilities.

---

## 🚀 Installation & Setup

To run this project locally, follow these steps:

### 1. Repository Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/farmsmart-ai.git

# Navigate to the project directory
cd farmsmart-ui
```

### 2. Dependency Installation
This project uses several key libraries for its functionality. Run the following command to install everything at once:
```bash
npm install
```

**What is being installed?**
*   **`@google/generative-ai`**: The official SDK to communicate with Gemini 1.5 Flash.
*   **`@vapi-ai/web`**: The SDK for our real-time conversational voice agent.
*   **`framer-motion`**: Powers our smooth glassmorphic transitions and scanning animations.
*   **`lucide-react`**: Provides our professional agricultural and UI iconography.
*   **`tailwindcss`**: Our utility-first CSS framework for that premium "Nature-Tech" look.

### 3. Environment Configuration
Create a file named `.env` in the root directory and add your API keys:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key_here
```

### 4. Start the Application
```bash
npm run dev
```
The app will typically run at `http://localhost:5173/` or `5174/`.

---

## 🧠 AI & Voice Integration Details

### 1. Google Gemini 1.5 Flash Integration
We selected **Gemini 1.5 Flash** for its speed and multimodal (Vision + Text) capabilities. It powers three core workflows:

*   **Smart Recommendations**: The AI analyzes regional climatic data, soil type, and sowing month to predict the top 3 most profitable crops. It also provides estimated profit margins in **Indian Rupees (INR)**.
*   **Vision-Based Soil Detection**: We implemented a multimodal prompt that allows Gemini to "look" at a photo of soil. It analyzes color and texture to identify the soil category (Loamy, Clayey, etc.), eliminating the need for farmers to know technical soil names.
*   **AI Health Scan (Plant Doctor)**: The AI identifies diseases, pests, or nutrient deficiencies from leaf photos and generates a structured 3-step treatment roadmap.

### 2. Vapi Conversational Agent Integration
To meet the **Voice-First** requirement, we integrated **Vapi** to create a living conversational assistant rather than a static text reader.

*   **Purpose**: Many farmers prefer speaking to reading. Vapi allows them to ask follow-up questions about crops, soil, or treatments in a natural way.
*   **Contextual Sync**: Our integration captures the farmer's current state (Location, Soil, and Recommended Crops) and streams it directly to the Vapi Assistant. This means the AI actually *knows* what is on the user's screen.
*   **High-Quality Audio**: Through Vapi, we leverage **11Labs** voices to provide a trustworthy, human-like voice that is easy for non-technical users to follow.

---

## ✨ Design Philosophy: "Nature-Tech"
The UI is built with a **Glassmorphic** design system:
*   **Visuals**: Uses soft forest greens, blurred overlays, and organic shadows to feel friendly yet premium.
*   **Animations**: Includes a "Laser-Scan" bar for the Health Scan to give users visual feedback that the AI is hard at work.
*   **Accessibility**: Features large typography, localized labels (Hindi, Punjabi, etc.), and a persistent Voice Assistant button.

---

## 📜 Disclaimer
*This application provides AI-generated agricultural advice for informational purposes. For critical pesticide applications or financial decisions, users are encouraged to consult their local Agricultural Extension Officer or KVK (Krishi Vigyan Kendra).*

### Developed for the [Hackathon Event] 🚜
🏆 **Revolutionizing digital inclusion for the global farming community.**
