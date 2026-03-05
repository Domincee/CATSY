import React, { useState } from 'react';
import { Menu, X, LogOut, User, CreditCard, Calendar, Home } from 'lucide-react';
import { mockAuth } from '../../data/mockAuth';

const Navbar = ({ activePage, onNavigate }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isLoggedIn, user } = mockAuth;

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navLinks = isLoggedIn
        ? [
            { id: 'home', label: 'Home', icon: Home },
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'loyalty', label: 'Loyalty Card', icon: CreditCard },
            { id: 'logout', label: 'Logout', icon: LogOut },
        ]
        : [
            { id: 'home', label: 'Home', icon: Home },
            { id: 'login', label: 'Login', icon: User },
            { id: 'reservation', label: 'Reservation', icon: Calendar },
        ];

    const handleLinkClick = (id) => {
        if (id === 'logout') {
            // Handle mock logout or just navigate to home
            console.log('Mock Logout Clicked');
            onNavigate('home');
        } else {
            onNavigate(id);
        }
        setIsMenuOpen(false);
    };

    return (
        <nav className="fixed top-0 w-full bg-white shadow-md z-[1000] font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo Section */}
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleLinkClick('home')}
                    >
                        <div className="flex flex-col leading-none select-none">
                            <span className="font-catsy text-2xl tracking-tight text-neutral-900 uppercase">
                                CATSY
                            </span>
                            <span className="font-coffee text-xl font-semibold text-neutral-500 uppercase">
                                COFFEE
                            </span>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-y-0 space-x-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => handleLinkClick(link.id)}
                                className={`text-lg font-semibold transition-colors duration-200 hover:text-neutral-900 ${activePage === link.id ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-500'
                                    }`}
                            >
                                {link.label}
                            </button>
                        ))}
                        {isLoggedIn && (
                            <div className="ml-4 flex items-center bg-neutral-100 px-4 py-2 rounded-full">
                                <span className="text-neutral-700 font-medium">Hi, {user.firstName}</span>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="text-neutral-900 focus:outline-none p-2"
                        >
                            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-neutral-100 animate-in slide-in-from-top duration-300">
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        {navLinks.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => handleLinkClick(link.id)}
                                className={`flex items-center w-full px-4 py-4 text-xl font-bold rounded-lg transition-colors ${activePage === link.id
                                        ? 'bg-neutral-900 text-white'
                                        : 'text-neutral-700 hover:bg-neutral-50'
                                    }`}
                            >
                                <link.icon className="mr-4" size={24} />
                                {link.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
