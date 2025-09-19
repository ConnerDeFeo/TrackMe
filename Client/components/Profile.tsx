import React, { useEffect } from "react";
import { Button, Text, TextInput, View } from "react-native";
import UserService from "../services/UserService";
import { useNavigation } from "@react-navigation/native";
import GeneralService from "../services/GeneralService";
import { useState } from "react";

//Profile page for both coaches and athletes
const Profile = () => {
    const navigation = useNavigation<any>();
    // State to hold current user data being displayed/edited
    const [userData, setUserData] = useState<Record<string, any>>([]);
    // State to track original data for comparison to detect changes
    const [originalUserData, setOriginalUserData] = useState<Record<string, any>>([]);
    //Account type used to potentially render more input fields for athletes
    const [accountType, setAccountType] = useState<string | null>(null);

    // Fetch user data when component mounts
    useEffect(()=>{
        const fetchUserData = async () => {
            const accountType = await UserService.getAccountType();
            setAccountType(accountType!);
            const userId = await UserService.getUserId();
            if(userId) {
                const resp = await GeneralService.getUser(userId);
                if(resp){
                const data = await resp.json();
                setUserData(data);
                setOriginalUserData(data); // Store original data for change detection
                }
            }
        };
        fetchUserData();
    },[])

    // Handle user logout and navigate to sign in screen
    const handleLogout = async () => {
        await UserService.signOut();
        navigation.navigate("Auth", { screen: "SignIn" });
    }

    // Update user profile only if field value has changed
    const handleUpdateProfile = async (field: string, value: string) => {
        // Only update if the value has actually changed
        if (originalUserData[field] !== value) {
            const accountType = await UserService.getAccountType();
            if(!accountType) 
                return;
            const resp = await GeneralService.updateUserProfile(userData, accountType);
            
            // Update original data after successful update to prevent duplicate calls
            if (resp) {
                setOriginalUserData({ ...originalUserData, [field]: value });
            }
        }
    }

    return (
        <View className="flex-1 bg-gray-50 px-6 pt-4">
            {/* Profile Picture Section */}
            <View className="items-center mb-8 ">
                {/* Placeholder profile picture with gradient background */}
                <View className="h-32 w-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full items-center justify-center shadow-lg mb-4">
                    <Text className="text-white text-lg font-semibold">PFP</Text>
                </View>
                {/* Display user's full name */}
                <Text className="text-2xl font-bold text-gray-800 mb-2">{userData.firstName} {userData.lastName}</Text>
                {/* Display username */}
                <Text className="text-gray-500 text-base">@{userData.username}</Text>
            </View>

            {/* Profile Form */}
            <View className="gap-y-4">
                {/* Bio input field - multiline text area */}
                <View>
                    <Text className="text-gray-700 font-medium mb-2">Bio</Text>
                    <TextInput
                        className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm"
                        placeholder="Tell us about yourself..."
                        value={userData.bio}
                        onChangeText={(text) => setUserData({ ...userData, bio: text })}
                        multiline
                        numberOfLines={3}
                        onBlur={() => handleUpdateProfile('bio', userData.bio)} // Save on blur
                    />
                </View>

                {/* First and Last name inputs in a row */}
                <View className="flex-row gap-x-3">
                    <View className="flex-1">
                        <Text className="text-gray-700 font-medium mb-2">First Name</Text>
                        <TextInput
                            className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm"
                            placeholder="First name"
                            value={userData.firstName}
                            onChangeText={(text) => setUserData({ ...userData, firstName: text })}
                            onBlur={() => handleUpdateProfile('firstName', userData.firstName)} // Save on blur
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-gray-700 font-medium mb-2">Last Name</Text>
                        <TextInput
                            className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm"
                            placeholder="Last name"
                            value={userData.lastName}
                            onChangeText={(text) => setUserData({ ...userData, lastName: text })}
                            onBlur={() => handleUpdateProfile('lastName', userData.lastName)} // Save on blur
                        />
                    </View>
                </View>

                {/* Gender input field */}
                <View>
                    <Text className="text-gray-700 font-medium mb-2">Gender</Text>
                    <TextInput
                        className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm"
                        placeholder="Gender"
                        value={userData.gender}
                        onChangeText={(text) => setUserData({ ...userData, gender: text })}
                        onBlur={() => handleUpdateProfile('gender', userData.gender)} // Save on blur
                    />
                </View>

                {/* Additional fields for athletes */}
                {accountType==="Athlete" && (
                    <View>
                        <Text className="text-gray-700 font-medium mb-2">Body Weight</Text>
                        <TextInput
                            className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm"
                            placeholder="lbs"
                            keyboardType="numeric"
                            value={userData.bodyWeight?.toString()}
                            onChangeText={(text) => setUserData({ ...userData, bodyWeight: text })}
                            onBlur={() => handleUpdateProfile('bodyWeight', userData.bodyWeight)} // Save on blur
                        />
                    </View>
                )}

                {/* Logout button */}
                <View className="mt-8">
                    <Button 
                    title="Sign Out" 
                    onPress={handleLogout} 
                    color={'#EF4444'}
                    />
                </View>
            </View>
        </View>
    );
};

export default Profile;
