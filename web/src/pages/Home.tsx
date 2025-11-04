import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const buttons = [
        { label: 'Relations', path: '/relations', img: 'Friends.png' },
        { label: 'History', path: '/history', img: 'History.png' }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-screen max-w-5xl mx-auto p-8">
            {buttons.map(({ label, path, img }) => (
                <button
                    key={path}
                    onClick={() => navigate(path)}
                    className="flex items-center justify-center h-80 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-2xl font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform duration-200"
                >
                    <img src={`assets/images/${img}`} alt={label} className="w-16 h-16 mr-4" />
                    {label}
                </button>
            ))}
        </div>
    );
};

export default Home;