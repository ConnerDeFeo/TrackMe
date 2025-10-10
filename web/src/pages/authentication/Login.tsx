import { useContext, useState } from 'react'
import UserService from '../../services/UserService'
import { AccountType } from '../../common/constants/Enums';
import { AuthContext } from '../../common/context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [_, setAccountType] = useContext(AuthContext);
    const handleSubmit = async () => {
        try {
            await UserService.signIn(email, password);
            const accountType: AccountType = await UserService.getAccountType();
            if (accountType !== AccountType.SignedOut) {
                setAccountType(accountType);
                window.location.replace('/'); // Redirect to home page after successful login
            } 
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An unknown error occurred.');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div
                className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6 relative"
            >
                <h2 className="text-2xl font-bold text-center">Login</h2>
                {error && <div className="text-red-500 text-sm text-center absolute top-16 left-0 right-0">{error}</div>}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Username or Email
                    </label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="you@example.com"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="********"
                    />
                </div>

                <button
                    className="w-full py-2 trackme-bg-blue text-white font-semibold rounded"
                    onClick={handleSubmit}
                >
                    Sign In
                </button>
            </div>
        </div>
    )
}

export default Login