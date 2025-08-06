import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type FooterProps = {
    buttons: [string, string][];
};

const Footer: React.FC<FooterProps> = ({ buttons }) => {
    const navigation = useNavigation<any>();

    return (
        <View className='h-[3rem] bg-gray-200 flex-row justify-around items-center'>
            {buttons.map(([label, destination], idx) => (
                <TouchableOpacity
                    key={idx}
                    onPress={() => navigation.navigate(destination)}
                >
                    <Text>{label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default Footer;

