import OpenAI from "openai";
import { getGuideParams } from "./params.js";
import { z } from "zod";

export const getGuide = async ({
  guideLink,
}: z.infer<typeof getGuideParams>) => {
  console.log("Received request for guide:", guideLink);
  try {
    // Remove the base URL prefix and ensure the path starts correctly
    const guidePath = guideLink.replace("https://docs.base.org", "");
    const githubRawUrl = `https://raw.githubusercontent.com/base/web/refs/heads/master/apps/base-docs/docs/pages${guidePath}.mdx`;
    console.log("Fetching from URL:", githubRawUrl);

    const response = await fetch(githubRawUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch guide: ${response.statusText}`);
    }
    const guide = await response.text();
    console.log("Successfully fetched guide content");

    let finalResult = guide;

    if (process.env.OPENAI_API_KEY) {
      try {
        const client = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        // Process the guide content with GPT-4
        console.log("Processing with ChatGPT...");
        const result = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a technical documentation assistant. Convert guides into structured JSON format with clear steps and important notes.",
            },
            {
              role: "user",
              content:
                "Convert this guide into a structured JSON of actions, including all steps and gotchas:\n\n" +
                guide,
            },
          ],
        });
        finalResult = result.choices[0]?.message?.content || guide;
        console.log("Successfully processed guide content");
      } catch (error) {
        console.error("Error processing with OpenAI:", error);
        // Fall back to raw guide if OpenAI processing fails
        finalResult = guide;
      }
    }

    return {
      content: [
        {
          type: "text" as const,
          text: finalResult,
        },
      ],
    };
  } catch (err) {
    const error = err as Error;
    console.error("Error processing guide:", error.message);
    return {
      content: [
        {
          type: "text" as const,
          text: `Error: ${error.message}`,
        },
      ],
    };
  }
};
