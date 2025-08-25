// We will use the official Google AI SDK now
import { GoogleGenerativeAI } from "@google/generative-ai";

// The handler function for Netlify
export const handler = async (event) => {
  // We only want to handle POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Get the API key from the environment variables
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        throw new Error("GEMINI_API_KEY is not defined in environment variables.");
    }

    // Initialize the Generative AI client
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Parse the prompt from the request body
    const { prompt } = JSON.parse(event.body);
    if (!prompt) {
        return { statusCode: 400, body: JSON.stringify({ error: "Prompt is missing from the request body." }) };
    }

    // Generate the content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Return the successful response
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text }),
    };

  } catch (error) {
    // Log the detailed error to the Netlify function logs for debugging
    console.error("Error generating content:", error);
    
    // Return a generic error message to the user
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch from Gemini API.' }),
    };
  }
};