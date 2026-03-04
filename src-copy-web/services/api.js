import { httpClient } from '../utils/httpClient';
import { loadingManager } from '../utils/loadingManager';
import { dispatchAuthError, parseErrorMessage } from '../utils/authErrorHandler';
import { apiDebugger } from '../utils/apiDebugger';
import { logger } from '../utils/logger';
import { getAccessToken } from '../utils/sessionManager';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const apiClient = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    const startTime = performance.now();
    const method = options.method || 'GET';

    const token = getAccessToken();
    if (import.meta.env.DEV) {
        logger.log('DEBUG API: Token', token ? `${token.substring(0, 10)}...` : 'null');
    }

    const headers = {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const requestId = crypto.randomUUID();
    if (import.meta.env.DEV) {
        apiDebugger.logRequest(url, method, headers, options.body, requestId);
    }

    try {
        loadingManager.start();
        const { response, data } = await httpClient(endpoint, { ...options, headers });
        const duration = performance.now() - startTime;
        const responseId = crypto.randomUUID();

        if (import.meta.env.DEV) {
            apiDebugger.logResponse(url, response.status, response.headers, data, duration, responseId);
        }

        if (!response.ok) {
            const errorMessage = parseErrorMessage(data);
            const isSessionError = dispatchAuthError(response, errorMessage, options.skipAuthError);
            if (!isSessionError) {
                throw new Error(errorMessage);
            }
            throw new Error(errorMessage);
        }
        return data;

    } catch (error) {
        if (import.meta.env.DEV) {
            apiDebugger.logError(url, error.message, crypto.randomUUID());
        }
        throw error;
    } finally {
        loadingManager.end();
    }
};
