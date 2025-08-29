import { GoogleGenAI } from "https://esm.sh/@google/genai";

const systemInstruction = `You are an expert assistant answering questions about alleged corruption cases in Georgia. You must base your answers strictly and exclusively on the provided Context. Follow these rules with extreme precision:

1.  **Relevance:** Your answer MUST ONLY contain information that is directly and specifically relevant to the user's Question. Do not include information about other cases or individuals, even if they are in the Context.
2.  **Language:** Your final, entire response MUST be in the Georgian language (ქართული).
3.  **Accuracy:** Answer only with information that is explicitly written in the Context. Do not use any external knowledge.
4.  **Style:** Answer concisely and factually. Do not add opinions.
5.  **Information Not Found:** If the answer to the Question cannot be found in the Context, you must reply with ONLY the following Georgian phrase: "ამის შესახებ სტატიაში ინფორმაცია არ მოიძებნა."
6.  **Citation:** At the end of your answer, you MUST cite the original source. To do this, find the line at the end of the relevant section in the Context that begins with \`წყარო:\` and exactly copy the source name and its URL. There always is the original source in the Context at the end of every case. Cite it in the following format: "წყარო: [source name](source URL)". Do not include any other text or explanations."`;

export default async (request, context) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!API_KEY) {
      console.error("Critical Error: GEMINI_API_KEY is not defined.");
      return new Response(JSON.stringify({ error: "API Key is not configured on the server." }), { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const { prompt } = await request.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is missing from the request." }), { status: 400 });
    }

    const geminiStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: systemInstruction,
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 8192,
        },
        thinkingConfig: {
          thinkingBudget: 0
        }
      }
    });

    const responseStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of geminiStream) {
          const text = chunk.text;
          controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      }
    });

    return new Response(responseStream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });

  } catch (error) {
    console.error("--- Full Error Log ---", error);
    const errorMessage = error.message || 'An unknown error occurred.';
    return new Response(JSON.stringify({ error: `დაფიქსირდა შეცდომა: ${errorMessage}` }), { status: 500 });
  }
};