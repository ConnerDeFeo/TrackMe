import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type FooterProps = {
    buttons: [string, string][];
};

//Footer at bottom of the screen with navigation buttons
const Footer: React.FC<FooterProps> = ({ buttons }) => {
    const navigation = useNavigation<any>();

    return (
        <View className='h-[5rem] bg-blue-500 flex-row justify-around items-center'>
            {buttons.map(([label, destination], idx) => (
                <TouchableOpacity
                    key={idx}
                    onPress={() => navigation.navigate(destination)}
                >
                    <Text className='text-white text-xl'>{label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default Footer;

