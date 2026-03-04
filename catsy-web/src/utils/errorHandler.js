/**
 * Maps raw error messages to user-friendly titles and messages.
 * @param {Error} err - The error object caught in try/catch blocks.
 * @param {string} defaultMessage - Fallback message if no specific match is found.
 * @returns {{ title: string, message: string }}
 */
export const mapAuthError = (err, defaultMessage = "We couldn't handle your request right now. Please check your connection and try again.") => {
    let message = err.message || defaultMessage;
    let title = "Something Went Wrong";

    if (message.includes('401') || message.includes('credential') || message.includes('Not authenticated')) {
        // If it's a login attempt, it's bad credentials.
        // If it's a session expiry, it's also 401. 
        // We can check if the user is already logged in to distinguish, but here we just provide a safe generic message.
        if (message.includes('Not authenticated')) {
            message = "Your session has expired. Please log in again to continue.";
            title = "Session Expired";
        } else {
            message = "Incorrect email or password. Please double-check your credentials.";
            title = "Authentication Failed";
        }
    } else if (message.includes('For your security') || message.includes('length')) {
        // Matches password length errors
        // message is already specific enough if it comes from our frontend validation
        if (message.includes('length')) message = "For your security, please use a password with at least 6 characters.";
        title = "Password Too Short";
    } else if (message.includes('match')) {
        message = "The passwords you entered do not match. Please try again.";
        title = "Passwords Do Not Match";
    } else if (message.includes('registered') || message.includes('exists')) {
        message = "This email is already associated with an existing account. Please try logging in instead.";
        title = "Email In Use";
    } else if (message.includes('First name') && message.includes('letters')) {
        message = "First name can only contain letters and spaces. Please remove any numbers or special characters.";
        title = "Invalid First Name";
    } else if (message.includes('Last name') && message.includes('letters')) {
        message = "Last name can only contain letters and spaces. Please remove any numbers or special characters.";
        title = "Invalid Last Name";
    } else if (message.includes('Contact') && message.includes('numbers')) {
        message = "Contact number can only contain numbers. Please remove any letters or special characters.";
        title = "Invalid Contact Number";
    } else if (message.includes('not a valid email') || message.includes('email_parsing') || message.includes('value is not a valid email')) {
        message = "Please enter a valid email address (e.g. name@example.com).";
        title = "Invalid Email";
    } else if (message.includes('Email is already registered')) {
        message = "This email is already being used by another account. Please use a different email address.";
        title = "Email Already Taken";
    } else if (message.includes('429') || message.includes('Rate limit') || message.includes('Too Many Requests')) {
        message = "Whoa, slow down! We've received too many requests from you. Please take a coffee break and try again in a minute.";
        title = "Too Many Requests";
    }

    return { title, message };
};
