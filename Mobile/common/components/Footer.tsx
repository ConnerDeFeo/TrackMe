import { useNavigation, useNavigationState } from '@react-navigation/native';
import { View, Pressable, Image } from 'react-native';

// Import all images statically
const images = {
    'Groups': require('../../assets/images/Groups.png'),
    'Inputs': require('../../assets/images/Input.png'),
    'Relations': require('../../assets/images/Friends.png'),
    'Template': require('../../assets/images/Template.png'),
    'Profile': require('../../assets/images/Profile.png'),
    'History': require('../../assets/images/History.png'),
    'Video': require('../../assets/images/Video.png'),
};

//Footer at bottom of the screen with navigation buttons
const Footer = ({buttons, currentRoute}: {buttons: string[][], currentRoute: string}) => {
    const navigation = useNavigation<any>();

    const handleNavigation = (destination: string) => {
        if (destination === currentRoute) return; // Do nothing if already on the desired route
        navigation.reset({
            index: 0,
            routes: [{ name: destination }],
        });
    };

    return (
        <View className='h-[6rem] border-t flex-row justify-around items-top pt-4'>
            {buttons.map(([imageName, destination], idx) => (
                <Pressable
                    key={idx}
                    onPress={() => handleNavigation(destination)}
                >
                    <Image source={images[imageName as keyof typeof images]} className="h-12 w-12" />
                </Pressable>
            ))}
        </View>
    );
};

export default Footer;

