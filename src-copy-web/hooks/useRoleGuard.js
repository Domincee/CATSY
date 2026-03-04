import { useUser } from '../context/UserContext';

export function useRoleGuard() {
    const { userInfo, isLoggedIn } = useUser();
    const role = userInfo?.role || null;

    return {
        isAuthenticated: isLoggedIn,
        role,
        isAdmin: role === 'admin' || role === 'staff',
        isCustomer: role === 'customer'
    };
}
