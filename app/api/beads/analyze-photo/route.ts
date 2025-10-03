import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/db";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ColorSuggestion {
  name: string;
  description: string;
  colors: string[]; // Array of HEX color codes
}

interface AnalysisResult {
  suggestions: ColorSuggestion[];
  analyzedColors: string[];
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");
    const mimeType = image.type;

    console.log("📸 Analyzing photo with OpenAI Vision...");

    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this image and extract colors that would work well for a beaded bracelet design.
              
Please identify:
1. The 3-5 most dominant colors in the image
2. Any accent colors that stand out
3. The overall color mood/theme (warm, cool, vibrant, pastel, etc.)

Then, create 3 different bracelet design suggestions:
1. **Monochromatic/Tonal**: Using shades of the main color(s)
2. **Complementary**: Using contrasting colors that work well together
3. **Accent**: Using the dominant color with pops of accent colors

For each suggestion, provide:
- A short descriptive name (e.g., "Ocean Blues", "Sunset Warmth")
- A brief description (1 sentence)
- 4-6 HEX color codes that match available bead colors

Return your response in this exact JSON format:
{
  "analyzedColors": ["#hex1", "#hex2", "#hex3", ...],
  "mood": "description of color mood",
  "suggestions": [
    {
      "name": "Design Name",
      "description": "Brief description",
      "colors": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5", "#hex6"]
    }
  ]
}`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const analysisResult = JSON.parse(content);
    console.log("✅ OpenAI Analysis Result:", analysisResult);

    // Fetch all available beads to match colors
    const availableBeads = await prisma.bead.findMany({
      where: {
        active: true,
      },
      select: {
        id: true,
        color: true,
        colorHex: true,
        diameterMm: true,
        name: true,
      },
    });

    // Helper function to find closest matching bead color
    const findClosestBead = (targetHex: string, size: number = 4.0) => {
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
            }
          : { r: 0, g: 0, b: 0 };
      };

      const colorDistance = (c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }) => {
        return Math.sqrt(
          Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2)
        );
      };

      const targetRgb = hexToRgb(targetHex);
      const beadsOfSize = availableBeads.filter((b) => b.diameterMm === size);

      let closestBead = beadsOfSize[0];
      let minDistance = Infinity;

      for (const bead of beadsOfSize) {
        if (!bead.colorHex) continue;
        const beadRgb = hexToRgb(bead.colorHex);
        const distance = colorDistance(targetRgb, beadRgb);

        if (distance < minDistance) {
          minDistance = distance;
          closestBead = bead;
        }
      }

      return closestBead;
    };

    // Map suggestions to actual available beads
    const mappedSuggestions = analysisResult.suggestions.map((suggestion: ColorSuggestion) => {
      const beadIds = suggestion.colors
        .map((hexColor) => {
          const bead = findClosestBead(hexColor);
          return bead?.id;
        })
        .filter(Boolean);

      return {
        ...suggestion,
        beadIds,
      };
    });

    return NextResponse.json({
      success: true,
      analyzedColors: analysisResult.analyzedColors,
      mood: analysisResult.mood,
      suggestions: mappedSuggestions,
    });
  } catch (error) {
    console.error("Error analyzing photo:", error);
    return NextResponse.json(
      { 
        error: "Failed to analyze photo",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
