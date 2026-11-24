import { useState, useEffect, useRef, useCallback } from 'react';
import { searchAddress } from '../services/geocoding.service';

/**
 * Custom hook for debounced address search using Nominatim
 *
 * @param {string} query - The search query
 * @param {number} delayMs - Debounce delay in milliseconds (default: 600ms)
 * @param {boolean} enabled - Whether automatic search is enabled
 */
export default function useAddressGeocoding(query, delayMs = 600, enabled = true) {
    const [rawSuggestions, setRawSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);

    const trimmed = query?.trim() || '';
    // Derived state: if trimmed length < 3, suggestions is naturally empty
    const suggestions = trimmed.length >= 3 ? rawSuggestions : [];

    const clearSuggestions = useCallback(() => {
        setRawSuggestions([]);
        setError(null);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (!enabled || trimmed.length < 3) {
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            setError(null);

            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            try {
                const results = await searchAddress(trimmed, abortControllerRef.current.signal);
                setRawSuggestions(results);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError('Unable to fetch address suggestions');
                    setRawSuggestions([]);
                }
            } finally {
                setIsLoading(false);
            }
        }, delayMs);

        return () => {
            clearTimeout(timer);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [trimmed, delayMs, enabled]);

    return {
        suggestions,
        isLoading: trimmed.length >= 3 ? isLoading : false,
        error: trimmed.length >= 3 ? error : null,
        clearSuggestions,
    };
}
