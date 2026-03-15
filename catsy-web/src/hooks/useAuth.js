import { useState, useEffect } from 'react';
import { customerService } from '../services/customerService';
import { mapAuthError } from '../utils/errorHandler';
import { logger } from '../utils/logger';
import { saveSession } from '../utils/sessionManager';
import { validatePassword, validateFormData } from '../utils/formValidator';

export function useAuth(onLoginSuccess, initialIsLogin = true) {
    const [isLogin, setIsLogin] = useState(initialIsLogin);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
    });
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        label: 'Weak',
        color: 'bg-red-500',
        feedback: []
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormError('');
    };

    useEffect(() => {
        if (isLogin || !formData.password) {
            setPasswordStrength({ score: 0, label: 'Weak', color: 'bg-red-500', feedback: [] });
            return;
        }

        const strength = validatePassword(formData.password);
        setPasswordStrength(strength);
    }, [formData.password, isLogin]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormError('');

        const validationError = validateFormData(formData, isLogin, passwordStrength);
        if (validationError) {
            setFormError(validationError);
            setLoading(false);
            return;
        }

        try {
            if (isLogin) {
                // Add artificial delay purely to VISUALLY demonstrate the "loading" button state requirement
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Mock success: username `test` / password `test123`
                if (formData.email === 'test' && formData.password === 'test123') {
                    const mockUser = { id: 'mock-id', firstName: 'Tester', accountId: '12345678', role: 'customer' };
                    saveSession(mockUser);
                    onLoginSuccess(mockUser);
                } else {
                    // Mock error: any other input → show error message UI
                    throw new Error('Invalid username or password');
                }
            } else {
                const newUser = await customerService.signup({
                    email: formData.email,
                    password: formData.password,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    role: 'customer'
                });

                if (newUser) {
                    const loginResponse = await customerService.login(formData.email, formData.password);
                    if (loginResponse) {
                        const userData = Array.isArray(loginResponse) ? loginResponse[0] : loginResponse;
                        const mappedUser = mapUserData(userData);
                        saveSession(mappedUser);
                        onLoginSuccess(mappedUser);
                    }
                }
            }
        } catch (err) {
            logger.error(err);
            const { title, message } = mapAuthError(err, isLogin);
            setFormError(`${title ? title + ': ' : ''}${message}`);
        } finally {
            setLoading(false);
        }
    };

    return {
        isLogin,
        setIsLogin,
        formData,
        handleChange,
        handleSubmit,
        loading,
        formError,
        passwordStrength,
        isPasswordStrong: isLogin || passwordStrength.score >= 5
    };
}

const mapUserData = (userData) => ({
    id: userData.id,
    email: userData.email,
    firstName: userData.first_name || userData.firstName,
    lastName: userData.last_name || userData.lastName,
    phone: userData.contact || userData.phone,
    accountId: (userData.account_id || userData.accountId) ? String(userData.account_id || userData.accountId) : null,
    role: userData.role || 'customer',
    access_token: userData.access_token,
    refresh_token: userData.refresh_token,
    favoriteItem: userData.favoriteItem || null,
    history: userData.history || []
});
