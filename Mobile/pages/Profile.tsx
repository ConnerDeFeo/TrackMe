import React, { useContext, useEffect } from "react";
import { Text, TextInput, Pressable, View, Alert, Image } from "react-native";
import UserService from "../services/UserService";
import GeneralService from "../services/GeneralService";
import { useState } from "react";
import { AuthContext } from "../common/context/AuthContext";
import { AccountType } from "../common/constants/Enums";
import TrackMeButton from "../common/components/display/TrackMeButton";
import ProfileInformation from "../common/components/profile/ProfileInformation";

//Profile page for both coaches and athletes
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
    // Editation flag
    const [isEditing, setIsEditing] = useState(false);

    // Fetch user data when component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = await UserService.getUserId();
                if (userId) {
                    const resp = await GeneralService.getUser();
                    if (resp) {
                        const data = await resp.json();
                        setUserData(data);
                        setOriginalUserData(data); // Store original data for change detection
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                Alert.alert('Error', 'Failed to load profile data');
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
        if (hasUnsavedChanges) {
            Alert.alert(
                'Unsaved Changes',
                'You have unsaved changes. Are you sure you want to sign out?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                        text: 'Sign Out', 
                        style: 'destructive',
                        onPress: async () => {
                            await UserService.signOut();
                            setAccountType(AccountType.SignedOut);
                        }
                    }
                ]
            );
        } else {
            await UserService.signOut();
            setAccountType(AccountType.SignedOut);
        }
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
                Alert.alert('Error', 'Failed to update profile. Please try again.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // Handle field changes with validation
    const handleFieldChange = (field: string, value: string) => {
        setUserData({ ...userData, [field]: value });
    };

    return (
        <View className="flex-1 bg-gray-50 min-h-screen">
            <View className="px-6 pb-8">
                <View className="flex-row w-full items-center justify-between my-6 bg-white rounded-2xl shadow-sm p-6">
                    <View className="flex-row">
                        <View className="rounded-full border h-32 w-32 bg-gray-200 flex items-center justify-center">
                            <Text>Profile pic</Text>
                        </View>
                        <Pressable onPress={() => {}} className="pl-4 py-2 pr-2">
                            <Image source={require("../assets/images/Edit.png")} className="h-6 w-6" />
                        </Pressable>
                    </View>
                    {/* Header Section */}
                    <View>
                        <View className="ml-auto"> 
                            {/* Display user's full name */}
                            <Text className="text-2xl font-bold text-gray-800 mb-1 text-right">
                                {userData.firstName} {userData.lastName}
                            </Text>
                            {/* Display username */}
                            <Text className="text-gray-500 text-base text-right">@{userData.username}</Text>
                            {/* Account type badge */}
                            <View className="bg-trackme-blue/10 px-3 py-1 rounded-full mt-2">
                                <Text className="text-trackme-blue text-sm font-medium text-right">
                                    {accountType}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Profile Form */}
                <View className="bg-white rounded-2xl p-6 shadow-sm">
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-xl font-bold text-gray-800">Profile Information</Text>
                        <Pressable onPress={() => setIsEditing(prev => !prev)} className="pl-4 py-2 pr-2">
                            <Image source={require("../assets/images/Edit.png")} className="h-6 w-6" />
                        </Pressable>
                    </View>
                    <View className="gap-y-5">
                        {/* Bio input field */}
                        <ProfileInformation
                            isEditing={isEditing}
                            data={userData.bio}
                            handleFieldChange={(text) => handleFieldChange('bio', text)}
                            dataEmpty="No bio provided."
                            title="Bio"
                        />

                        {/* First and Last name inputs */}
                        <View className="flex-row gap-x-3">
                            <ProfileInformation
                                isEditing={isEditing}
                                data={userData.firstName}
                                handleFieldChange={(text) => handleFieldChange('firstName', text)}
                                dataEmpty="First name"
                                title="First Name"
                                className="flex-1"
                            />
                            <ProfileInformation
                                isEditing={isEditing}
                                data={userData.lastName}
                                handleFieldChange={(text) => handleFieldChange('lastName', text)}
                                dataEmpty="Last name"
                                title="Last Name"
                                className="flex-1"
                            />
                        </View>
                    </View>

                    {/* Save Changes Button */}
                    {hasUnsavedChanges && (
                        <View className="mt-6 pt-4 border-t border-gray-100">
                            <Pressable
                                onPress={handleSaveChanges}
                                disabled={isSaving}
                                className={`p-4 rounded-xl items-center ${
                                    isSaving ? 'bg-gray-300' : 'bg-trackme-blue'
                                }`}
                            >
                                <Text className="trackme-blue font-semibold text-base">
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Text>
                            </Pressable>
                        </View>
                    )}
                </View>

                {/* Logout Section */}
                <View className="mt-6">
                    <TrackMeButton text="Sign Out" onPress={handleLogout} />
                </View>
            </View>
        </View>
    );
};

export default Profile;
