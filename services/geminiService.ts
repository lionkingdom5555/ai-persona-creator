// This function now acts as a client to your secure Netlify serverless function.
// It no longer handles the Gemini API call directly.

export async function generatePersonaImage(prompt: string, base64Image: string | null): Promise<string> {
  // ----------------------------------------------------------------------------------
  // IMPORTANT: Replace this placeholder with the actual URL of your deployed Netlify function.
  // You can find this in your Netlify project dashboard.
  // Example: 'https://my-proxy-name.netlify.app/.netlify/functions/generateImage'
  // ----------------------------------------------------------------------------------
  const netlifyFunctionUrl = 'https://YOUR_NETLIFY_FUNCTION_URL_HERE/.netlify/functions/generateImage';

  // Runtime check to prevent accidental use of the placeholder URL.
  if (netlifyFunctionUrl.includes('YOUR_NETLIFY_FUNCTION_URL_HERE')) {
    throw new Error("Please replace the placeholder URL in `services/geminiService.ts` with your actual Netlify function URL.");
  }

  try {
    const response = await fetch(netlifyFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, base64Image }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred on the server.' }));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data.imageUrl) {
        throw new Error("Image URL was not returned from the server.");
    }
    
    return data.imageUrl;

  } catch (error) {
    console.error("Error calling the secure Netlify function:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while trying to generate the image.");
  }
}