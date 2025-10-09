import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../common/context/AuthContext";
import UserService from "../services/UserService";
import GeneralService from "../services/GeneralService";
import { AccountType } from "../common/constants/Enums";

const Profile = () => {
    const context = useContext(AuthContext);
    const [accountType, setAccountType] = context;
    // State to hold current user data being displayed/edited
    const [userData, setUserData] = useState<Record<string, any>>({});
    // State to track original data for comparison to detect changes
    const [originalUserData, setOriginalUserData] = useState<Record<string, any>>({});
    // Loading and feedback states
    const [isSaving, setIsSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Fetch user data when component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            const resp = await GeneralService.getUser();
            if (resp.ok) {
                const data = await resp.json();
                setUserData(data);
                setOriginalUserData(data); // Store original data for change detection
            }
        };
        fetchUserData();
    }, []);

    // Check for unsaved changes whenever userData changes
    useEffect(() => {
        const hasChanges = JSON.stringify(userData) !== JSON.stringify(originalUserData);
        setHasUnsavedChanges(hasChanges);
    }, [userData, originalUserData]);

    // Handle user logout and navigate to sign in screen
    const handleLogout = async () => {
        await UserService.signOut();
        setAccountType(AccountType.SignedOut);
    };

    // Save all profile changes
    const handleSaveChanges = async () => {
        if (!hasUnsavedChanges) return;
        
        setIsSaving(true);
        try {
            const accountType = await UserService.getAccountType();
            if (!accountType) return;
            
            const resp = await GeneralService.updateUserProfile(userData);
            
            if (resp) {
                setOriginalUserData({ ...userData });
                setHasUnsavedChanges(false);
            } else {
                alert('Error');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error');
        } finally {
            setIsSaving(false);
        }
    };

    // Handle field changes with validation
    const handleFieldChange = (field: string, value: string) => {
        setUserData({ ...userData, [field]: value });
    };

    return(
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto p-6">
                {/* Header Section */}
                <div className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
                    <div className="flex flex-col items-center">
                        {/* Avatar Circle */}
                        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-trackme-blue font-bold text-3xl mb-4">
                            {userData.firstName?.charAt(0)?.toUpperCase() || 'U'}
                            {userData.lastName?.charAt(0)?.toUpperCase() || ''}
                        </div>
                        
                        {/* Display user's full name */}
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            {userData.firstName} {userData.lastName}
                        </h1>
                        
                        {/* Display username */}
                        <p className="text-gray-500 text-lg mb-3">@{userData.username}</p>
                        
                        {/* Account type badge */}
                        <div className="bg-blue-50 px-4 py-1.5 rounded-full">
                            <span className="text-trackme-blue text-sm font-medium">
                                {accountType}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h2>
                    
                    <div className="space-y-6">
                        {/* Bio input field */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Bio</label>
                            <textarea
                                className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-trackme-blue focus:border-transparent transition-all"
                                placeholder="Tell us about yourself..."
                                value={userData.bio || ''}
                                onChange={(e) => handleFieldChange('bio', e.target.value)}
                                rows={4}
                            />
                        </div>

                        {/* First and Last name inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">First Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-trackme-blue focus:border-transparent transition-all"
                                    placeholder="First name"
                                    value={userData.firstName || ''}
                                    onChange={(e) => handleFieldChange('firstName', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Last Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-trackme-blue focus:border-transparent transition-all"
                                    placeholder="Last name"
                                    value={userData.lastName || ''}
                                    onChange={(e) => handleFieldChange('lastName', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Changes Button */}
                    {hasUnsavedChanges && (
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <button
                                onClick={handleSaveChanges}
                                disabled={isSaving}
                                className={`w-full p-4 rounded-xl font-semibold text-base transition-colors ${
                                    isSaving 
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                        : 'trackme-bg-blue text-white hover:opacity-90'
                                }`}
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Logout Section */}
                <div className="mt-6">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 hover:bg-red-600 text-white p-4 rounded-xl font-semibold text-base shadow-sm transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;