/**
 * OpenStreetMap Nominatim Geocoding Service
 *
 * Adheres to OSM Nominatim Usage Policy:
 * - Debounced requests
 * - In-memory client caching
 * - Format: jsonv2 / json with address details
 * - Max results: 5
 */

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

// Client-side query cache to prevent redundant API calls
const geocodeCache = new Map();

export async function searchAddress(query, signal) {
    const trimmed = query?.trim();
    if (!trimmed || trimmed.length < 3) {
        return [];
    }

    const cacheKey = trimmed.toLowerCase();
    if (geocodeCache.has(cacheKey)) {
        return geocodeCache.get(cacheKey);
    }

    const params = new URLSearchParams({
        q: trimmed,
        format: 'json',
        addressdetails: '1',
        limit: '5',
    });

    try {
        const response = await fetch(`${NOMINATIM_BASE_URL}?${params.toString()}`, {
            signal,
            headers: {
                'Accept-Language': 'en',
            },
        });

        if (!response.ok) {
            throw new Error(`Geocoding failed with status: ${response.status}`);
        }

        const data = await response.json();
        const results = Array.isArray(data)
            ? data.map((item) => ({
                  placeId: item.place_id,
                  displayName: item.display_name,
                  lat: parseFloat(item.lat),
                  lon: parseFloat(item.lon),
                  type: item.type,
                  importance: item.importance,
              }))
            : [];

        geocodeCache.set(cacheKey, results);
        return results;
    } catch (err) {
        if (err.name === 'AbortError') {
            return [];
        }
        console.warn('Geocoding request error:', err);
        throw err;
    }
}
