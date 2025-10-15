import * as z from "zod";
import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../config/env.js";

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

const suggestionSchema = z.object({
  name: z.string(),
  category: z.string(),
  reason: z.string(),
  priority: z.enum(["low", "medium", "high"]),
  quantity: z.number().optional(),
  unit: z.string().optional(),
});

const outputSchema = z.object({
  suggestions: z.array(suggestionSchema),
});

export async function generateSuggestions(items: any[]) {
  const itemsJson = JSON.stringify(items, null, 2);

  const prompt = `
You are a grocery shopping assistant.

Current shopping list items (full objects):
${itemsJson}

Strictly return **valid JSON only** in the following format. Do not add any extra commentary or explanation:

{
  "suggestions": [
    {
      "name": "string",
      "category": "produce | dairy | meat | pantry | beverages | snacks | other",
      "reason": "string",
      "priority": "low | medium | high",
      "quantity": number (optional),
      "unit": "string (optional)"
    }
  ]
}
  `;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    console.log("result:", result.text);
    let raw = result.text ?? "";

    // Step 1: Clean markdown formatting
    const clean = raw
      .replace(/```json|```/g, "") // remove ```json or ```
      .replace(/[\u0000-\u001F]+/g, "") // remove stray control chars
      .trim();

    // Step 2: Parse safely
    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch (err) {
      console.error("❌ JSON parsing failed:", err);
      console.error("🪵 Raw AI output:", raw);
      throw new Error("AI returned invalid JSON format. Check model output.");
    }

    return outputSchema.parse(parsed);
  } catch (err) {
    console.error("AI generation error:", err);
    return { suggestions: [] };
  }
}
