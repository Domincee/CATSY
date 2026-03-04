export const dispatchAuthError = (response, errorMessage, skipAuthError = false) => {
    const isSessionError = (response.status === 401 || errorMessage === 'USER_NOT_FOUND') && !skipAuthError;
    
    if (isSessionError) {
        let helpfulMessage = "Your session has expired. Please log in again.";
        let helpfulTitle = "Session Expired";

        if (errorMessage === 'USER_NOT_FOUND') {
            helpfulMessage = "Account deactivated or removed.";
            helpfulTitle = "Account Deactivated";
        }

        window.dispatchEvent(new CustomEvent('auth-error', {
            detail: {
                message: helpfulMessage,
                title: helpfulTitle,
                status: response.status
            }
        }));
    }
    
    return isSessionError;
};

export const parseErrorMessage = (data) => {
    if (typeof data.detail === 'string') {
        return data.detail;
    } else if (Array.isArray(data.detail)) {
        return data.detail.map(e => e.msg || e.message || JSON.stringify(e)).join(', ');
    } else if (data.message) {
        return data.message;
    }
    return 'Network response was not ok';
};
