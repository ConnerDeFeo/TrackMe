import { SafeAreaView } from 'react-native';
import './global.css'
import Setup from './pages/Authentication/Setup';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ComponentType } from 'react';
import CreateAccount from './pages/Authentication/CreateAccount';
import { Amplify } from 'aws-amplify';
import awsConfig from './aws-config';
import ConfirmEmail from './pages/Authentication/ConfirmEmail';
import HomePage from './pages/athletes/AthleteHomePage';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import AuthCheck from './pages/Authentication/AuthCheck';
import SignIn from './pages/Authentication/SignIn';
import Footer from './components/Footer';
import AthleteHomePage from './pages/athletes/AthleteHomePage';
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

function AthleteLayout(content: React.ReactElement): ComponentType<any>{
  return ()=>{
    return(
      <SafeAreaView className='bg-white flex-1'>
        {content}
        <Footer buttons={[['Home', 'Home'], ['Settings', 'Settings']]} />
      </SafeAreaView>
    ); 
  }
}

function CoachLayout(content: React.ReactElement): ComponentType<any>{
  return ()=>{
    return(
      <SafeAreaView className='bg-white flex-1'>
        {content}
        <Footer buttons={[['Home', 'Home'], ['Settings', 'Settings']]} />
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
    Setup: BaseLayout(<Setup/>),
    CreateAccount: BaseLayout(<CreateAccount/>),
    SignIn: BaseLayout(<SignIn/>),
    ConfirmEmail: BaseLayout(<ConfirmEmail/>),
    HomePage: BaseLayout(<HomePage/>),
    AuthCheck:BaseLayout(<AuthCheck/>),
    AthleteHomePage: AthleteLayout(<AthleteHomePage/>),
  },
});
const Navigation = createStaticNavigation(RootStack);

//Return the navigation stack as the app
export default function App() {
  return <Navigation />;
}