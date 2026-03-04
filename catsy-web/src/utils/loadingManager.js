let activeRequests = 0;

const startRequest = () => {
    activeRequests++;
    if (activeRequests === 1) {
        window.dispatchEvent(new CustomEvent('global-loading-start'));
    }
};

const endRequest = () => {
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0) {
        setTimeout(() => {
            if (activeRequests === 0) {
                window.dispatchEvent(new CustomEvent('global-loading-end'));
            }
        }, 300);
    }
};

export const loadingManager = {
    start: startRequest,
    end: endRequest,
    getActiveCount: () => activeRequests
};
