import React, { useContext, useEffect } from "react";
import { Text, TextInput, Pressable, View, ScrollView, Alert } from "react-native";
import UserService from "../services/UserService";
import GeneralService from "../services/GeneralService";
import { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { AccountType } from "../assets/constants/Enums";

//Profile page for both coaches and athletes
const Profile = () => {
    const context = useContext(AuthContext);
    const [accountType, setAccountType] = context;
    // State to hold current user data being displayed/edited
    const [userData, setUserData] = useState<Record<string, any>>({});
    // State to track original data for comparison to detect changes
    const [originalUserData, setOriginalUserData] = useState<Record<string, any>>({});
    // Loading and feedback states
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Fetch user data when component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
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
            } finally {
                setIsLoading(false);
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
            
            const resp = await GeneralService.updateUserProfile(userData, accountType);
            
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
                {/* Header Section */}
                <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                    <View className="items-center">
                        
                        {/* Display user's full name */}
                        <Text className="text-2xl font-bold text-gray-800 mb-1">
                            {userData.firstName} {userData.lastName}
                        </Text>
                        {/* Display username */}
                        <Text className="text-gray-500 text-base">@{userData.username}</Text>
                        {/* Account type badge */}
                        <View className="bg-trackme-blue/10 px-3 py-1 rounded-full mt-2">
                            <Text className="text-trackme-blue text-sm font-medium">
                                {accountType}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Profile Form */}
                <View className="bg-white rounded-2xl p-6 shadow-sm">
                    <Text className="text-xl font-bold text-gray-800 mb-6">Profile Information</Text>
                    
                    <View className="gap-y-5">
                        {/* Bio input field */}
                        <View>
                            <Text className="text-gray-700 font-semibold mb-2">Bio</Text>
                            <TextInput
                                className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-800"
                                placeholder="Tell us about yourself..."
                                value={userData.bio || ''}
                                onChangeText={(text) => handleFieldChange('bio', text)}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>

                        {/* First and Last name inputs */}
                        <View className="flex-row gap-x-3">
                            <View className="flex-1">
                                <Text className="text-gray-700 font-semibold mb-2">First Name</Text>
                                <TextInput
                                    className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-800"
                                    placeholder="First name"
                                    value={userData.firstName || ''}
                                    onChangeText={(text) => handleFieldChange('firstName', text)}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-700 font-semibold mb-2">Last Name</Text>
                                <TextInput
                                    className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-800"
                                    placeholder="Last name"
                                    value={userData.lastName || ''}
                                    onChangeText={(text) => handleFieldChange('lastName', text)}
                                />
                            </View>
                        </View>

                        {/* Additional fields for athletes */}
                        {accountType === AccountType.Athlete && (
                            <View>
                                <Text className="text-gray-700 font-semibold mb-2">Body Weight</Text>
                                <TextInput
                                    className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-800"
                                    placeholder="Enter weight in lbs"
                                    keyboardType="numeric"
                                    value={userData.bodyWeight?.toString() || ''}
                                    onChangeText={(text) => handleFieldChange('bodyWeight', text)}
                                />
                            </View>
                        )}
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
                    <Pressable
                        onPress={handleLogout}
                        className="bg-red-500 p-4 rounded-xl items-center shadow-sm"
                    >
                        <Text className="text-white font-semibold text-base">Sign Out</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default Profile;
