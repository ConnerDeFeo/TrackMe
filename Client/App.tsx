import { View } from 'react-native';
import './global.css'
import Setup from './pages/authentication/Setup';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ComponentType } from 'react';
import CreateAccount from './pages/authentication/CreateAccount';
import { Amplify } from 'aws-amplify';
import awsConfig from './aws-config';
import ConfirmEmail from './pages/authentication/ConfirmEmail';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import AuthCheck from './pages/authentication/AuthCheck';
import SignIn from './pages/authentication/SignIn';
import Footer from './components/Footer';
import UserIcon from './components/UserIcon';
import CoachGroups from './pages/coaches/groups/CoachGroups';
import AthleteGroups from './pages/athletes/AthleteGroups';
import CoachProfile from './pages/coaches/CoachProfile';
import AthleteProfile from './pages/athletes/AthleteProfile';
import CreateGroup from './pages/coaches/groups/CreateGroup';
import ViewGroup from './pages/coaches/groups/ViewGroup';
import AddAthlete from './pages/coaches/AddAthlete';
import Athletes from './pages/coaches/Athletes';
import Coaches from './pages/athletes/Coaches';
//Root component used to render everything
Amplify.configure(awsConfig);

//Base page layout for all components
function BaseLayout(content: React.ReactElement): ComponentType<any>{
  return ()=>{
    return(
      <>
        <View className='bg-white flex-1'>
          {content}
        </View>
      </>
    ); 
  }
}

function AthleteLayout(content: React.ReactElement): ComponentType<any>{
  return ()=>{
    return(
      <>
        <View className='bg-white flex-1'>
          <UserIcon />
          {content}
        </View>
        <Footer buttons={[['Groups', 'AthleteGroups'], ['Inputs', 'Inputs'], ['Coaches', 'Coaches']]} />
      </>
    ); 
  }
}

function CoachLayout(content: React.ReactElement): ComponentType<any>{
  return ()=>{
    return(
      <>
        <View className='bg-white flex-1'>
          <UserIcon />
          {content}
        </View>
        <Footer buttons={[['Groups', 'CoachGroups'], ['Athletes', 'Athletes']]} />
      </>
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
    AuthCheck:BaseLayout(<AuthCheck/>),
    CoachGroups: CoachLayout(<CoachGroups/>),
    AthleteGroups: AthleteLayout(<AthleteGroups/>),
    CoachProfile: CoachLayout(<CoachProfile/>),
    AthleteProfile: AthleteLayout(<AthleteProfile/>),
    CreateGroup: CoachLayout(<CreateGroup/>),
    ViewGroup: CoachLayout(<ViewGroup/>),
    AddAthlete: CoachLayout(<AddAthlete/>),
    Athletes: CoachLayout(<Athletes/>),
    Coaches: AthleteLayout(<Coaches/>)
  },
});
const Navigation = createStaticNavigation(RootStack);

//Return the navigation stack as the app
export default function App() {
  return <Navigation />;
}