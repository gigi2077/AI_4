const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      console.error("Critical Error: GEMINI_API_KEY is not defined.");
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: "The API Key is not configured on the server." }) 
      };
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const { prompt } = JSON.parse(event.body || "{}");
    if (!prompt) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: "Prompt is missing from the request." }) 
      };
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;

    // --- NEW, SMARTER CHECKING ---
    // Log the full response from Google to your Netlify function logs for debugging.
    // This will show you exactly WHY a response might be blocked.
    console.log("Full Gemini Response:", JSON.stringify(response, null, 2));

    // Check if the response was blocked or is empty.
    if (!response.candidates || response.candidates.length === 0 || !response.candidates[0].content) {
      console.error("Response was blocked or empty. Finish Reason:", response.promptFeedback?.blockReason || response.candidates?.[0]?.finishReason);
      
      // Send a more specific error message to the user
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "მოდელმა უსაფრთხოების ფილტრის გამო პასუხი დაბლოკა. გთხოვთ, შეცვალოთ მოთხოვნა." }) // "The model blocked the response due to the safety filter. Please change the request."
      };
    }
    // --- END OF NEW CHECKING ---

    const text = response.text();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text }),
    };

  } catch (error) {
    console.error("--- Full Error Log ---", error);
    const errorMessage = error.message || 'An unknown error occurred.';
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `დაფიქსირდა შეცდომა: ${errorMessage}` }),
    };
  }
};