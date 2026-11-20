import { ChatGroq } from "@langchain/groq";

import { issueClassificationPrompt } from "../prompts/issue.prompt.js";

import { issueClassificationSchema } from "../validators/ai.validator.js";

import { config } from "../config/config.js";

const model = new ChatGroq({
    apiKey: config.GROQ_API_KEY,
    model: config.GROQ_MODEL || "openai/gpt-oss-120b",
    temperature: 0,
});

const structuredModel = model.withStructuredOutput(
    issueClassificationSchema,
    {
        method: "functionCalling",
    }
);

const classificationChain = issueClassificationPrompt.pipe(
    structuredModel
);

export const classifyIssue = async ({ title, description }) => {

    const result = await classificationChain.invoke({
        title,
        description,
    });

    // Validate the final result again before returning it.
    return issueClassificationSchema.parse(result);
};