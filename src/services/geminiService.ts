import { GoogleGenAI, Type } from "@google/genai";
import { Question, Difficulty, GrammarPoint } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateQuestions(count: number = 5): Promise<Question[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate ${count} English grammar multiple-choice questions for junior high school students. 
    The questions should cover various grammar points like Relative Clauses, Adverbial Clauses, Non-finite Verbs, Conjunctions, etc.
    Each question must have exactly one correct answer.
    Provide detailed explanations in Chinese.
    Return the data in the specified JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            sentence: { type: Type.STRING, description: "The sentence with {{0}} as the blank." },
            options: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              description: "An array containing one array of 4 options for the blank."
            },
            correctAnswers: { 
              type: Type.ARRAY, 
              items: { type: Type.INTEGER },
              description: "An array containing the index of the correct option (0-3)."
            },
            difficulty: { 
              type: Type.STRING, 
              enum: Object.values(Difficulty),
              description: "The difficulty level."
            },
            grammarPoint: { 
              type: Type.STRING, 
              enum: Object.values(GrammarPoint),
              description: "The grammar point being tested."
            },
            explanation: {
              type: Type.OBJECT,
              properties: {
                rule: { type: Type.STRING, description: "The grammar rule in Chinese." },
                example: { type: Type.STRING, description: "A similar example sentence in English." },
                commonMistake: { type: Type.STRING, description: "Common mistakes students make in Chinese." },
                analysis: { type: Type.STRING, description: "Detailed analysis of this specific question in Chinese." }
              },
              required: ["rule", "example", "commonMistake", "analysis"]
            }
          },
          required: ["id", "sentence", "options", "correctAnswers", "difficulty", "grammarPoint", "explanation"]
        }
      }
    }
  });

  try {
    const questions = JSON.parse(response.text || "[]");
    return questions;
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return [];
  }
}
