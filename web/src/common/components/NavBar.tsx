import { Link, useLocation } from 'react-router-dom';

/**
 * NavBar Component
 * 
 * A modern navigation bar for the TrackMe web application.
 * Provides navigation to 5 main sections: Profile, Groups, Friends, Workout Templates, and History.
 */
const NavBar = () => {
    const location = useLocation();
    
    // Navigation items configuration
    const navItems: { path: string; label: string; image: string }[] = [
        { path: '/groups', label: 'Groups', image: '/assets/images/Groups.png' },
        { path: '/friends', label: 'Friends', image: '/assets/images/Friends.png'},
        { path: '/workout-templates', label: 'Workout Templates', image: '/assets/images/Template.png'},
        { path: '/history', label: 'History', image: '/assets/images/History.png' },
        { path: '/profile', label: 'Profile', image: '/assets/images/Profile.png' },
    ];

    // Check if current path matches nav item
    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className={`bg-white shadow-md`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-trackme-blue">
                            TrackMe
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                                    isActive(item.path)
                                        ? 'border-b trackme-border-blue'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <img src={item.image} alt={item.label} className="h-5 w-5" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            type="button"
                            className="text-gray-700 hover:text-trackme-blue focus:outline-none focus:text-trackme-blue"
                            onClick={() => {/* Toggle mobile menu */}}
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation (hidden by default) */}
                <div className="md:hidden hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 ${
                                    isActive(item.path)
                                        ? 'bg-trackme-blue text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <img src={item.image} alt={item.label} className="h-5 w-5" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;