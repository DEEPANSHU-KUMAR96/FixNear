import { ChatGroq } from "@langchain/groq";
import { z } from "zod";

import Issue from "../models/issue.model.js";
import { duplicateIssuePrompt } from "../prompts/duplicate.prompt.js";

const duplicateSchema = z.object({
    duplicates: z.array(
        z.object({
            issueId: z.string(),
            similarity: z.enum(["High", "Medium"]),
            reason: z.string(),
        })
    ),
});

const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL,
    temperature: 0,
});

const structuredModel = model.withStructuredOutput(
    duplicateSchema,
    { method: "functionCalling" }
);

const duplicateChain = duplicateIssuePrompt.pipe(structuredModel);

export const findDuplicateIssues = async ({
    title,
    description,
    category,
    location,
}) => {
    // 1. Find existing unresolved complaints
    const candidates = await Issue.find({
        category,
        status: { $ne: "Resolved" },
    })
        .select("title description category location status createdAt")
        .sort({ createdAt: -1 })
        .limit(15)
        .lean();

    if (!candidates.length) {
        return {
            hasDuplicates: false,
            duplicates: [],
        };
    }

    // 2. Prepare complaint data for AI
    const candidateData = candidates.map((issue) => ({
        issueId: issue._id.toString(),
        title: issue.title,
        description: issue.description,
        category: issue.category,
        location: issue.location,
        status: issue.status,
    }));

    // 3. Ask AI to compare complaints
    const result = await duplicateChain.invoke({
        newIssue: JSON.stringify({
            title,
            description,
            category,
            location,
        }),
        candidates: JSON.stringify(candidateData),
    });

    // 4. Only accept IDs that actually exist in our candidates
    const candidateIds = new Set(
        candidateData.map((issue) => issue.issueId)
    );

    const validDuplicates = result.duplicates
        .filter((item) => candidateIds.has(item.issueId))
        .map((item) => {
            const issue = candidates.find(
                (candidate) =>
                    candidate._id.toString() === item.issueId
            );

            return {
                issueId: item.issueId,
                title: issue.title,
                location: issue.location,
                status: issue.status,
                similarity: item.similarity,
                reason: item.reason,
            };
        });

    return {
        hasDuplicates: validDuplicates.length > 0,
        duplicates: validDuplicates,
    };
};
