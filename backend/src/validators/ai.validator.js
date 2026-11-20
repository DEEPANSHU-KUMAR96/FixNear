import { z } from "zod";

export const issueClassificationSchema = z.object({
    category: z.enum([
        "Road",
        "Water",
        "Electricity",
        "Sanitation",
        "Drainage",
        "Other",
    ]),

    priority: z.enum([
        "Low",
        "Medium",
        "High",
    ]),

    summary: z.string().min(10).max(300),

    reason: z.string().min(5).max(300),
});