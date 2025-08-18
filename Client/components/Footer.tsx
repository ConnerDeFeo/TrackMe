import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Import all images statically
const images = {
    'Groups': require('../images/Groups.png'),
    'Inputs': require('../images/Groups.png'),
    'Coaches': require('../images/Groups.png'),
    'Workouts': require('../images/Workouts.png'),
    'Athletes': require('../images/Athletes.png'),
    'Profile': require('../images/Profile.png')
};

//Footer at bottom of the screen with navigation buttons
const Footer: React.FC<{ buttons: string[][] }> = ({ buttons }) => {
    const navigation = useNavigation<any>();

    return (
        <View className='h-[5rem] border-t flex-row justify-around items-center'>
            {buttons.map(([imageName, destination], idx) => (
                <TouchableOpacity
                    key={idx}
                    onPress={() => navigation.navigate(destination)}
                >
                    <Image source={images[imageName as keyof typeof images]} className="h-12 w-12" />
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default Footer;

