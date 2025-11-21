import { GoogleGenAI } from "@google/genai";
import { Category } from "../types";
import { Language } from "../context/LanguageContext";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API Key not found");
    }
    return new GoogleGenAI({ apiKey });
};

export const generateJobDescription = async (title: string, category: Category, language: Language): Promise<string> => {
    try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
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

export const analyzeProfileImprovement = async (currentBio: string, language: Language): Promise<string> => {
    try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
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

export const getMarketInsights = async (language: Language): Promise<string> => {
     try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Provide a very short (2 sentences) market insight trend for the creative economy in Kazakhstan (Almaty/Astana) for 2025.
            Output the text in ${language === 'kk' ? 'Kazakh' : language === 'ru' ? 'Russian' : 'English'} language.`,
        });
        return response.text || "Creative market is growing rapidly in Almaty.";
    } catch (error) {
        return "Unable to fetch live insights.";
    }
}