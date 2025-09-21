import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '../services/AsyncStorage';
import { useNav } from '../hooks/useNav';

// Import all images statically
const images = {
    'Groups': require('../assets/images/Groups.png'),
    'Inputs': require('../assets/images/Input.png'),
    'Coaches': require('../assets/images/Friends.png'),
    'Workouts': require('../assets/images/Sprinter.png'),
    'Athletes': require('../assets/images/Friends.png'),
    'Profile': require('../assets/images/Profile.png'),
    'History': require('../assets/images/History.png'),
};

const layouts = {
  'athlete': [
    ['Inputs', 'Inputs'], 
    ['History', 'InputHistory'], 
    ['Groups', 'AthleteGroups'], 
    ['Coaches', 'Coaches'], 
    ['Profile', 'AthleteProfile']
  ],
  'coach': [
    ['Workouts', 'WorkoutTemplates'], 
    ['History', 'CoachHistory'], 
    ['Groups', 'CoachGroups'], 
    ['Athletes', 'Athletes'], 
    ['Profile', 'CoachProfile']
  ]
}

//Footer at bottom of the screen with navigation buttons
const Footer = () => {
    const {replace} = useNav();
    const [buttons, setButtons] = React.useState<string[][]>([]);

    useEffect(() => {
        const fetchAccountType = async () => {
            const userType = await AsyncStorage.getData('accountType');
            if(userType == 'Athlete'){
                setButtons(layouts['athlete']);
                return;
            }
            setButtons(layouts['coach']);
        }
        fetchAccountType();
    }, []);

    return (
        <View className='h-[6rem] border-t flex-row justify-around items-top pt-4'>
            {buttons.map(([imageName, destination], idx) => (
                <TouchableOpacity
                    key={idx}
                    onPress={() => replace(destination)}
                >
                    <Image source={images[imageName as keyof typeof images]} className="h-12 w-12" />
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default Footer;

