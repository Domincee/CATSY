export const apiDebugger = {
    logRequest: (url, method, headers, body, requestId) => {
        window.dispatchEvent(new CustomEvent('api-debug', {
            detail: {
                id: requestId,
                type: 'request',
                url,
                method,
                headers,
                body: body ? JSON.parse(body) : null,
                timestamp: new Date().toISOString()
            }
        }));
    },
    
    logResponse: (url, status, headers, body, duration, responseId) => {
        window.dispatchEvent(new CustomEvent('api-debug', {
            detail: {
                type: 'response',
                url,
                status,
                headers: Object.fromEntries(headers.entries()),
                body,
                duration: `${duration.toFixed(0)}ms`,
                timestamp: new Date().toISOString(),
                id: responseId
            }
        }));
    },
    
    logError: (url, message, errorId) => {
        window.dispatchEvent(new CustomEvent('api-debug', {
            detail: {
                type: 'error',
                url,
                message,
                timestamp: new Date().toISOString(),
                id: errorId
            }
        }));
    }
};
