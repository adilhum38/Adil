
import { GoogleGenAI } from "@google/genai";
import { Category } from "../types";
import { Language } from "../context/LanguageContext";

// Fixed: Initializing Google GenAI client once using the environment variable directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Fixed: Updated to use 'gemini-3-flash-preview' as recommended for basic text tasks.
// Fixed: Using .text property directly instead of .text() method.
export const generateJobDescription = async (title: string, category: Category, language: Language): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Write a professional and engaging job description for a "${title}" in the category of "${category}".
            The location is Kazakhstan. Include responsibilities and required skills.
            Keep it concise, under 150 words. 
            Tone: Professional yet creative.
            IMPORTANT: Output the description in ${language === 'kk' ? 'Kazakh' : language === 'ru' ? 'Russian' : 'English'} language.`,
        });
        return response.text || "Could not generate description.";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Error generating description. Please try again.";
    }
};

// Fixed: Updated to use 'gemini-3-flash-preview' for profile bio rewriting.
export const analyzeProfileImprovement = async (currentBio: string, language: Language): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Act as a career coach for the creative industry. Rewrite the following bio to be more impactful and attractive to clients in Kazakhstan:
            "${currentBio}"
            
            Output ONLY the rewritten bio in ${language === 'kk' ? 'Kazakh' : language === 'ru' ? 'Russian' : 'English'} language.`,
        });
        return response.text || currentBio;
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Error analyzing profile.";
    }
};

// Fixed: Updated to use 'gemini-3-flash-preview' for market insights.
export const getMarketInsights = async (language: Language): Promise<string> => {
     try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Provide a very short (2 sentences) market insight trend for the creative economy in Kazakhstan (Almaty/Astana) for 2025.
            Output the text in ${language === 'kk' ? 'Kazakh' : language === 'ru' ? 'Russian' : 'English'} language.`,
        });
        return response.text || "Creative market is growing rapidly in Almaty.";
    } catch (error) {
        return "Unable to fetch live insights.";
    }
}
