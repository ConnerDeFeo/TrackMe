import React, { useEffect } from "react";
import { Button, Text, TextInput, View } from "react-native";
import UserService from "../services/UserService";
import { useNavigation } from "@react-navigation/native";
import GeneralService from "../services/GeneralService";
import { useState } from "react";

//Profile page for both coaches and athletes
const Profile = () => {
    const navigation = useNavigation<any>();
    const [userData, setUserData] = useState<Record<string, any>>([]);

    useEffect(()=>{
        const fetchUserData = async () => {
        const userId = await UserService.getUserId();
        if(userId) {
            const resp = await GeneralService.getUser(userId);
            if(resp){
            const data = await resp.json();
            setUserData(data);
            }
        }
        };
        fetchUserData();
    },[])

    const handleLogout = async () => {
        await UserService.signOut();
        navigation.navigate("SignIn");
    }

    const handleUpdateProfile = async ()=>{
        const accountType = await UserService.getAccountType();
        if(!accountType) 
            return;
        const resp = await GeneralService.updateUserProfile(userData, accountType);
    }

    return (
        <View className="flex-1 bg-gray-50 px-6 pt-16">
            {/* Profile Picture Section */}
            <View className="items-center mb-8">
                <View className="h-32 w-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full items-center justify-center shadow-lg mb-4">
                    <Text className="text-white text-lg font-semibold">PFP</Text>
                </View>
                <Text className="text-2xl font-bold text-gray-800 mb-2">{userData.firstName} {userData.lastName}</Text>
                <Text className="text-gray-500 text-base">@{userData.username}</Text>
                </View>

                {/* Profile Form */}
                <View className="space-y-4">
                <View>
                    <Text className="text-gray-700 font-medium mb-2">Bio</Text>
                    <TextInput
                        className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm"
                        placeholder="Tell us about yourself..."
                        value={userData.bio}
                        onChangeText={(text) => setUserData({ ...userData, bio: text })}
                        multiline
                        numberOfLines={3}
                        onBlur={handleUpdateProfile}
                    />
                </View>

                <View className="flex-row space-x-3">
                    <View className="flex-1">
                        <Text className="text-gray-700 font-medium mb-2">First Name</Text>
                        <TextInput
                            className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm"
                            placeholder="First name"
                            value={userData.firstName}
                            onChangeText={(text) => setUserData({ ...userData, firstName: text })}
                            onBlur={handleUpdateProfile}
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-gray-700 font-medium mb-2">Last Name</Text>
                        <TextInput
                            className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm"
                            placeholder="Last name"
                            value={userData.lastName}
                            onChangeText={(text) => setUserData({ ...userData, lastName: text })}
                            onBlur={handleUpdateProfile}
                        />
                    </View>
                </View>

                <View>
                    <Text className="text-gray-700 font-medium mb-2">Gender</Text>
                    <TextInput
                        className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm"
                        placeholder="Gender"
                        value={userData.gender}
                        onChangeText={(text) => setUserData({ ...userData, gender: text })}
                        onBlur={handleUpdateProfile}
                    />
                </View>

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
