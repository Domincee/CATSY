import React, { useState } from 'react';
import MobileShell from './components/Layout/MobileShell';
import HomePage from './pages/HomePage';
import LoyaltyPage from './pages/LoyaltyPage';
import ProfilePage from './pages/ProfilePage';
import ReservationPage from './pages/ReservationPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import AdminLogin from './pages/admin/components/AdminLogin';
import StatusModal from './components/UI/StatusModal';
import CustomerToast from './components/UI/CustomerToast';
import GlobalCustomerLoading from './components/UI/GlobalCustomerLoading';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import initialTablesData from './data/tables.json';
import { useTableAvailability } from './hooks/useTableAvailability';
import { logger } from './utils/logger';
import { UserProvider, useUser } from './context/UserContext';
import { SettingsProvider } from './context/SettingsContext';
import { useRoleGuard } from './hooks/useRoleGuard';
import AdminWarningBanner from './components/UI/AdminWarningBanner';

gsap.registerPlugin(ScrollTrigger);

function AppContent() {
    const getInitialPage = () => {
        const path = window.location.pathname.replace('/', '');
        const validPages = ['home', 'loyalty', 'profile', 'reservation', 'login', 'signup', 'admin', 'admin/login'];
        if (path === 'admin/login') return 'admin/login';
        return validPages.includes(path) ? path : 'home';
    };

    const { isLoggedIn, userInfo, setUserInfo, login, isDeactivated, confirmDeactivation, authError, isInitialized } = useUser();
    const { isAdmin } = useRoleGuard();
    const [activePage, setActivePage] = useState(getInitialPage);
    const dynamicData = useTableAvailability(initialTablesData);

    logger.log('App Rendered. Active Page:', activePage);

    if (!isInitialized) return null;

    /**
     * Global Session-Expired Modal (SRP / DIP)
     * Defined once here and included in ALL routing branches so it always renders
     * regardless of whether the user is on the admin panel or a customer page.
     */
    const adminAuthErrorModal = (
        <StatusModal
            isOpen={isDeactivated}
            onClose={confirmDeactivation}
            type="error"
            title={authError?.title || "Session Expired"}
            message={authError?.message || "Your session has expired. Please sign in again."}
            closeLabel="Sign Out"
        />
    );

    const customerAuthErrorModal = (
        <CustomerToast
            isOpen={isDeactivated}
            onClose={confirmDeactivation}
            type="error"
            title={authError?.title || "Session Expired"}
            message={authError?.message || "Your session has expired. Please sign in again."}
            closeLabel="Sign Out"
        />
    );

    // ── Admin Login ──
    if (activePage === 'admin/login') {
        return (
            <>
                <AdminLogin onLoginSuccess={(user) => {
                    login(user);
                    window.location.href = '/admin';
                }} />
                {adminAuthErrorModal}
            </>
        );
    }

    // ── Admin Dashboard ──
    if (activePage === 'admin') {
        if (!isLoggedIn || !isAdmin) {
            window.location.href = '/admin/login';
            return null;
        }
        return (
            <>
                <AdminPage />
                {adminAuthErrorModal}
            </>
        );
    }


    // ── Customer Routes ──
    const renderPage = () => {
        logger.log('Rendering page for:', activePage);
        switch (activePage) {
            case 'home': return <HomePage isLoggedIn={isLoggedIn} onNavigate={setActivePage} tablesData={dynamicData} />;
            case 'loyalty': return <LoyaltyPage />;
            case 'profile': return <ProfilePage userInfo={userInfo || {}} setUserInfo={setUserInfo} />;
            case 'reservation': return <ReservationPage isLoggedIn={isLoggedIn} userInfo={userInfo} onLoginReq={() => setActivePage('login')} tablesData={dynamicData} />;
            case 'login': return isAdmin
                ? (window.location.href = '/admin') || null
                : <LoginPage onLoginSuccess={(user) => { login(user); setActivePage('profile'); }} />;
            case 'signup': return <LoginPage initialIsLogin={false} onLoginSuccess={(user) => { login(user); setActivePage('profile'); }} />;
            default: return <HomePage onNavigate={setActivePage} tablesData={dynamicData} />;
        }
    };

    return (
        <MobileShell activePage={activePage} setActivePage={setActivePage}>
            {isAdmin && <AdminWarningBanner />}
            <GlobalCustomerLoading />
            {renderPage()}
            {customerAuthErrorModal}
        </MobileShell>
    );
}

export default function App() {
    return (
        <UserProvider>
            <SettingsProvider>
                <AppContent />
            </SettingsProvider>
        </UserProvider>
    );
}
