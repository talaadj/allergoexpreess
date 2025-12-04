import { GoogleGenAI, Modality } from "@google/genai";
import { GeoLocation, ModelType } from "../types";

// Helper to ensure API Key exists
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing in environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateTextResponse = async (
  prompt: string,
  modelType: ModelType,
  history: { role: string; parts: { text: string }[] }[] = [],
  location?: GeoLocation
) => {
  const client = getClient();
  const systemInstruction = `
You are the **AI Medical Assistant** for **AllergoExpress Immunolab**.
You are available **24/7** to answer calls and messages.
You are fluent in **Russian (Русский)** and **Kazakh (Қазақша)**.
Your tone is professional, empathetic, and efficient.

**KEY INFORMATION FROM LAB REFERRAL FORM:**

1.  **SERVICE**: Express analysis for specific IgE (ELISA method 88-95%) to medications.
2.  **PRICE**: **6500 KZT** per ONE preparation. Blood sampling is paid separately.
3.  **EXPRESS ANALYSIS**: **8000 KZT** (2 hours). Available ONLY at **Shagabutdinova 132**.
4.  **RESULTS**: Standard: Same day at 17:00. Express: 12:00-14:00 (Sampling 8:00-12:00).
5.  **CONTACT**: Call Center **+7 707 566 8899**.

**PREPARATION RULES (STRICT):**
*   **Strictly on an empty stomach** (3 hours minimum fasting).
*   **MANDATORY**: Exclude/Stop taking antihistamines (anti-allergy drugs) **3 DAYS** before the test. This is crucial for accuracy.

**AVAILABLE TESTS (DRUG LIST):**
You can check for allergies to the following specific drugs:
*   **Anesthetics**: Articaine Hydrochloride 4%, Articaine + Epinephrine (Ultracaine), Mepivacaine 3% (Scandonest), Orabloc, Septanest with adrenaline, Ubistesin / Ubistesin Forte, Lidocaine, Novocaine, Mepivastesin.
*   **Antibiotics**: Cephalosporin, Amoxicillin, Azithromycin.
*   **Anti-inflammatory/Pain**: Diclofenac, Ibuprofen, Ketoprofen, Paracetamol.

**LOCATIONS:**
Main Lab: **Shagabutdinova 132**.
Other branches: Rozybakiev 33A, Serkebaeva 146/12 (Comfort City), Rayimbek 540/7 (LB Clinic), and others.

**YOUR GOAL:**
Answer questions about PRICE (6500 kzt / 8000 express), PREPARATION (3 days no meds), and LIST OF DRUGS.
Always remind them: "I am an AI. My advice does not replace a doctor's consultation."
`;

  const config: any = {
    systemInstruction,
    temperature: 0.4, // Low temp for factual accuracy
  };

  // Configure tools based on model type
  if (modelType === ModelType.FLASH_GROUNDED) {
    const tools: any[] = [{ googleSearch: {} }];

    // Add maps if we have location
    if (location) {
      tools.push({ googleMaps: {} });
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: location.latitude,
            longitude: location.longitude
          }
        }
      };
    }
    config.tools = tools;
  }

  // Model selection logic
  const modelId = modelType;

  try {
    const chat = client.chats.create({
      model: modelId,
      config,
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const response = await chat.sendMessage({ message: prompt });

    return {
      text: response.text,
      groundingMetadata: response.candidates?.[0]?.groundingMetadata
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateSpeech = async (text: string) => {
  const client = getClient();
  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data returned");
    return base64Audio;
  } catch (error) {
    console.error("TTS Error:", error);
    throw error;
  }
};