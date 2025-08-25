const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // 1. Get the API Key from Netlify's environment variables
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      console.error("Critical Error: GEMINI_API_KEY is not defined.");
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: "The API Key is not configured on the server." }) 
      };
    }

    // 2. Initialize the Google AI client with the key
    const genAI = new GoogleGenerativeAI(API_KEY);

    // ---- Use Gemini 2.5 Flash (official model ID) ----
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    // --------------------------------------------------

    // 3. Get the user's prompt from the request
    const { prompt } = JSON.parse(event.body || "{}");
    if (!prompt) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: "Prompt is missing from the request." }) 
      };
    }

    // 4. Call the Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. Send the successful response back to the front-end
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text }),
    };

  } catch (error) {
    console.error("--- Full Error Log ---");
    console.error(error);
    console.error("--- End Error Log ---");

    const errorMessage = error.message || 'An unknown error occurred.';
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `დაფიქსირდა შეცდომა: ${errorMessage}` }),
    };
  }
};
