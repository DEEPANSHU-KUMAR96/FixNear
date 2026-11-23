import { useState } from 'react';
import { checkDuplicates } from '../services/ai.service';

/**
 * Hook for AI duplicate issue detection.
 * Returns { checkForDuplicates, isChecking, result, error, clearResult }
 *
 * result shape: { hasDuplicates: boolean, duplicates: Array<{
 *   issueId, title, location, status, similarity, reason
 * }> }
 */
export default function useAiDuplicates() {
    const [isChecking, setIsChecking] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const checkForDuplicates = async ({ title, description, category, location }) => {
        if (!title?.trim() || !description?.trim() || !category?.trim() || !location?.trim()) {
            setError('Please fill in Title, Description, Category and Location before checking for duplicates.');
            return null;
        }

        setError('');
        setResult(null);
        setIsChecking(true);

        try {
            const data = await checkDuplicates({
                title: title.trim(),
                description: description.trim(),
                category: category.trim(),
                location: location.trim(),
            });
            setResult(data);
            return data;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                'Duplicate check failed. Please try again.';
            setError(msg);
            return null;
        } finally {
            setIsChecking(false);
        }
    };

    const clearResult = () => {
        setResult(null);
        setError('');
    };

    return { checkForDuplicates, isChecking, result, error, clearResult };
}
