export const validatePassword = (password) => {
    const requirements = [
        { id: 'length', text: 'Min 8 characters', met: password.length >= 8 },
        { id: 'upper', text: 'Uppercase letter', met: /[A-Z]/.test(password) },
        { id: 'lower', text: 'Lowercase letter', met: /[a-z]/.test(password) },
        { id: 'number', text: 'Number', met: /\d/.test(password) },
        { id: 'special', text: 'Special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
    ];

    const metCount = requirements.filter(r => r.met).length;
    let label = 'Weak';
    let color = 'bg-red-500';

    if (metCount > 4) {
        label = 'Strong';
        color = 'bg-green-500';
    } else if (metCount > 2) {
        label = 'Moderate';
        color = 'bg-yellow-500';
    }

    return { 
        score: metCount, 
        label, 
        color, 
        feedback: requirements,
        isStrong: metCount >= 5
    };
};

export const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
};

export const validateEmail = (email) => {
    return email.includes('@');
};

export const validatePasswordMatch = (password, confirmPassword) => {
    return password === confirmPassword;
};

export const validateFormData = (formData, isLogin, passwordStrength) => {
    if (!isLogin) {
        if (formData.password !== formData.confirmPassword) {
            return "The passwords you entered do not match. Please try again.";
        }
        if (passwordStrength.score < 5) {
            return "For your security, please use a stronger password that meets all requirements.";
        }
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            return "Please enter your first and last name.";
        }

        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(formData.firstName) || !nameRegex.test(formData.lastName)) {
            return "Names can only contain letters and spaces.";
        }
    }
    if (!formData.email.includes('@')) {
        return "Please enter a valid email address.";
    }
    return null;
};
