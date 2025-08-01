import { SafeAreaView } from 'react-native';
import './global.css'
import Setup from './pages/Setup';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ComponentType } from 'react';
import CreateAccount from './pages/CreateAccount';
import SignIn from './pages/SignIn';
import { Amplify } from 'aws-amplify';
import awsConfig from './aws-config';
import ConfirmEmail from './pages/ConfirmEmail';
import HomePage from './pages/HomePage';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import AuthCheck from './pages/AuthCheck';
//Root component used to render everything
Amplify.configure(awsConfig);

//Base page layout for all components
function BaseLayout(content: React.ReactElement): ComponentType<any>{
  return ()=>{
    return(
      <SafeAreaView className='bg-white flex-1'>
        {content}
      </SafeAreaView>
    ); 
  }
}
//Directory allowing page navigation
const RootStack = createNativeStackNavigator({
  initialRouteName: 'AuthCheck',
  screenOptions: {
    headerShown: false
  },
  screens: {
    Home: BaseLayout(<Setup/>),
    CreateAccount: BaseLayout(<CreateAccount/>),
    SignIn: BaseLayout(<SignIn/>),
    ConfirmEmail: BaseLayout(<ConfirmEmail/>),
    HomePage: BaseLayout(<HomePage/>),
    AuthCheck:BaseLayout(<AuthCheck/>)
  },
});
const Navigation = createStaticNavigation(RootStack);

//Return the navigation stack as the app
export default function App() {
  return <Navigation />;
}