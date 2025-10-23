import DateService from "../../services/DateService";
import Inputs from "../../common/components/athletes/inputs/Inputs";
import { UIManager } from 'react-native';
import { NativeModules } from 'react-native';
import { Platform } from 'react-native';
import * as ExpoModules from 'expo-modules-core';

//Page where athletes input times
const TodayInputs = ()=>{
    console.log('=== SVG DEBUG ===');
    console.log('Is DEV?', __DEV__);
    console.log('Platform:', Platform.OS);
    console.log('Expo modules available?', ExpoModules);
    console.log('RNSVGCircle:', UIManager.getViewManagerConfig('RNSVGCircle'));
    console.log('RNSVGPath:', UIManager.getViewManagerConfig('RNSVGPath'));
    console.log('RNSVGSvgViewAndroid:', UIManager.getViewManagerConfig('RNSVGSvgViewAndroid'));
    console.log('All Native Modules:', Object.keys(NativeModules));
    console.log('Looking for SVG-related modules...');
    Object.keys(NativeModules).forEach(key => {
    if (key.toLowerCase().includes('svg')) {
        console.log('Found SVG module:', key);
    }
    });
    console.log('=== SVG DEBUG END ===');
    // Current date for the given inputs
    return(
        <Inputs
            date={DateService.formatDate(new Date())}
            workoutGroupButton
        />
    );
}

export default TodayInputs;