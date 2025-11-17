// File: netlify/functions/generateImage.mjs
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;

// CORS headers to allow requests from your GitHub Pages site
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*', // Allows any origin, you can restrict this to your GitHub Pages URL for more security
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async (req, context) => {
  // Handle preflight CORS request
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (!API_KEY) {
    return new Response(JSON.stringify({ error: "API key not configured on server" }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { 
      status: 405, 
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const { prompt, base64Image } = await req.json();

    if (base64Image) {
      const mimeType = base64Image.substring(base64Image.indexOf(":") + 1, base64Image.indexOf(";"));
      const data = base64Image.split(',')[1];
      const imagePart = { inlineData: { mimeType, data } };
      const textPart = { text: prompt };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [imagePart, textPart] },
        config: { responseModalities: [Modality.IMAGE] },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          return new Response(JSON.stringify({ imageUrl }), {
            status: 200,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
          });
        }
      }
    } else {
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
      });

      if (response.generatedImages && response.generatedImages.length > 0) {
        const imageUrl = `data:image/png;base64,${response.generatedImages[0].image.imageBytes}`;
        return new Response(JSON.stringify({ imageUrl }), {
          status: 200,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
      }
    }
    
    throw new Error("No image generated from API. It may have been blocked for safety reasons.");

  } catch (error) {
    console.error("Error in Netlify function:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to generate image on the server" }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
};
