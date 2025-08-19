// Save this as netlify/functions/debug.js
exports.handler = async function (event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  const API_KEY = process.env.GEMINI_API_KEY;
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      hasApiKey: !!API_KEY,
      apiKeyLength: API_KEY ? API_KEY.length : 0,
      apiKeyPrefix: API_KEY ? API_KEY.substring(0, 8) + '...' : 'Not found',
      allEnvVars: Object.keys(process.env).filter(key => key.includes('GEMINI')),
      timestamp: new Date().toISOString()
    }),
  };
};