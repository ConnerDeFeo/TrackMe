import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '../services/AsyncStorage';

// Import all images statically
const images = {
    'Groups': require('../images/Groups.png'),
    'Inputs': require('../images/Input.png'),
    'Coaches': require('../images/Friends.png'),
    'Workouts': require('../images/Sprinter.png'),
    'Athletes': require('../images/Friends.png'),
    'Profile': require('../images/Profile.png'),
    'History': require('../images/History.png'),
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
    const navigation = useNavigation<any>();
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

