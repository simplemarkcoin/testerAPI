
import { GoogleGenAI } from "@google/genai";
import type { ApiRequest, ApiResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const createPrompt = (request: ApiRequest, response: ApiResponse): string => {
  const { method, url, headers, body, params, auth } = request;
  const { status, statusText, headers: resHeaders, body: resBody } = response;
  
  const requestDetails = `
- Method: ${method}
- URL: ${url}
- Auth: ${JSON.stringify(auth, null, 2)}
- Params: ${JSON.stringify(params, null, 2)}
- Headers: ${JSON.stringify(headers, null, 2)}
- Body: ${body || 'No body sent.'}
`;

  const responseDetails = `
- Status: ${status} ${statusText}
- Headers: ${JSON.stringify(resHeaders, null, 2)}
- Body: ${typeof resBody === 'object' ? JSON.stringify(resBody, null, 2) : resBody || 'No body received.'}
`;

  return `
You are an expert API assistant. Your goal is to help a developer understand the result of an API call they just made. Be professional, clear, and beginner-friendly. Do not use markdown formatting like ### or lists with *. Just use plain text with newlines.

Here is the request that was made:
${requestDetails}

Here is the response that was received:
${responseDetails}

Please provide the following analysis:

**Summary**
A brief, one-sentence summary of what happened.

**Status Code Explained**
Explain what the status code (${status}) means in the context of this API call.

**Analysis & Next Steps**
Based on the request and response, provide a detailed analysis.
- If the request was successful (2xx), explain what the response data represents and suggest how it could be used.
- If the request failed (4xx/5xx), explain the most likely cause of the error. Analyze the request and the error message in the response body to provide specific troubleshooting steps.
- Suggest concrete next steps the developer could take, such as trying a different parameter, checking their authentication token, or correcting the request body.
`;
};

export const analyzeApiResponse = async (request: ApiRequest, response: ApiResponse): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Error: API_KEY environment variable is not set. Please configure it to use the AI Assistant.";
  }
  
  try {
    const prompt = createPrompt(request, response);
    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return result.text;
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    return `An error occurred while analyzing the response: ${error.message}`;
  }
};
