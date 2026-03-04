const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const httpClient = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    const method = options.method || 'GET';
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        data = await response.json();
    }
    
    return { response, data };
};
