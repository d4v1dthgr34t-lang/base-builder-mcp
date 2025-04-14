import { z } from "zod";
import { findGuideParamsPrompt } from "./utils.js";


export const getGuideParams = z.object({
  guideLink: z.string().describe(findGuideParamsPrompt),
});

