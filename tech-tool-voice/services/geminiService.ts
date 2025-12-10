// services/geminiService.ts
import { sendMessage } from "./api";

export const generateSpeech = async (
  prompt: string,
  voiceName: string
): Promise<string> => {
  // Call the Netlify function via our helper
  return await sendMessage(prompt, voiceName);
};
