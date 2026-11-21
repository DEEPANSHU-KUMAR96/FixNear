import { useState } from 'react';
import { classifyIssue } from '../services/ai.service';

/**
 * Hook for AI issue classification.
 * Returns { classify, isClassifying, result, error, clearResult }
 */
export default function useAiClassify() {
    const [isClassifying, setIsClassifying] = useState(false);
    const [result, setResult] = useState(null);   // { category, priority, summary, reason }
    const [error, setError] = useState('');

    const classify = async ({ title, description }) => {
        if (!title?.trim() || !description?.trim()) {
            setError('Please fill in both Title and Description before using AI classification.');
            return null;
        }

        setError('');
        setResult(null);
        setIsClassifying(true);

        try {
            const data = await classifyIssue({ title: title.trim(), description: description.trim() });
            setResult(data);
            return data;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                'AI classification failed. Please try again.';
            setError(msg);
            return null;
        } finally {
            setIsClassifying(false);
        }
    };

    const clearResult = () => {
        setResult(null);
        setError('');
    };

    return { classify, isClassifying, result, error, clearResult };
}
