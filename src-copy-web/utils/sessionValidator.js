import { customerService } from '../services/customerService';
import { logger } from './logger';

export const validateSessionWithServer = async (user) => {
    try {
        const freshProfile = await customerService.getProfile(user.id);
        
        const refreshedUser = {
            ...user,
            email: freshProfile.email ?? user.email,
            firstName: freshProfile.first_name ?? user.firstName,
            lastName: freshProfile.last_name ?? user.lastName,
            phone: freshProfile.contact ?? user.phone,
            accountId: freshProfile.account_id != null
                ? String(freshProfile.account_id)
                : user.accountId,
            role: freshProfile.role ?? user.role,
            is_active: freshProfile.is_active ?? user.is_active,
        };
        
        logger.log('UserContext: session refreshed from DB');
        return { success: true, user: refreshedUser };
    } catch (error) {
        const isAuthError = 
            error.message === 'USER_NOT_FOUND' ||
            error.message.includes('401') ||
            error.message.includes('403') ||
            error.message.toLowerCase().includes('expired') ||
            error.message.toLowerCase().includes('invalid token');
        
        if (isAuthError) {
            return { 
                success: false, 
                error: { 
                    title: "Session Expired", 
                    message: "Your session has expired or is invalid. Please sign in again." 
                } 
            };
        }
        
        throw error;
    }
};

export const isAuthError = (error) => {
    return (
        error.message === 'USER_NOT_FOUND' ||
        error.message.includes('401') ||
        error.message.includes('403') ||
        error.message.toLowerCase().includes('expired') ||
        error.message.toLowerCase().includes('invalid token')
    );
};
