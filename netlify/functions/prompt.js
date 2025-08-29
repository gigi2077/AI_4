const { GoogleGenAI } = require("@google/genai");

// The system instruction remains the same, as its content is correct.
const systemInstruction = `You are an expert assistant answering questions about alleged corruption cases in Georgia. You must base your answers strictly and exclusively on the provided Context. Follow these rules with extreme precision:

1.  **Relevance:** Your answer MUST ONLY contain information that is directly and specifically relevant to the user's Question. Do not include information about other cases or individuals, even if they are in the Context.
2.  **Language:** Your final, entire response MUST be in the Georgian language (ქართული).
3.  **Accuracy:** Answer only with information that is explicitly written in the Context. Do not use any external knowledge.
4.  **Style:** Answer concisely and factually. Do not add opinions.
5.  **Information Not Found:** If the answer to the Question cannot be found in the Context, you must reply with ONLY the following Georgian phrase: "მოწოდებულ ტექსტში ამის შესახებ ინფორმაციას ვერ ვპოულობ."
6.  **Citation:** At the end of your answer, you MUST cite the original source. To do this, find the line at the end of the relevant section in the Context that begins with \`წყარო:\` and exactly copy the source name and its URL. Cite it in the following format: "წყარო: [source name](source URL)". Do not include any other text or explanations."`;

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

    // Corrected: Use GoogleGenAI with an options object for the constructor.
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const { prompt } = JSON.parse(event.body || "{}");
    if (!prompt) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: "Prompt is missing from the request." }) 
      };
    }

    // Corrected: Use the direct ai.models.generateContent method from the new SDK.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 8192,
        },
        thinkingConfig: {
          thinkingBudget: 0
        }
      }
    });
    
    // Corrected: Access the generated text directly as a property.
    const text = response.text;

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