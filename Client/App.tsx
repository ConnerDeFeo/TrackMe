import { ScrollView, View } from 'react-native';
import './global.css'
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ComponentType } from 'react';
import CreateAccount from './pages/authentication/CreateAccount';
import { Amplify } from 'aws-amplify';
import awsConfig from './aws-config';
import ConfirmEmail from './pages/authentication/ConfirmEmail';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import SignIn from './pages/authentication/SignIn';
import Footer from './components/Footer';
import CoachGroups from './pages/coaches/groups/CoachGroups';
import AthleteGroups from './pages/athletes/AthleteGroups';
import CreateGroup from './pages/coaches/groups/CreateGroup';
import AddAthlete from './pages/coaches/AddAthlete';
import Athletes from './pages/coaches/Athletes';
import Coaches from './pages/athletes/Coaches';
import AssignAthletes from './pages/coaches/groups/AssignAthletes';
import CreateWorkout from './pages/coaches/workout/CreateWorkout';
import Workouts from './pages/coaches/workout/Workouts';
import AssignWorkout from './pages/coaches/groups/AssignWorkout';
import ViewGroupInputsCoach from './pages/coaches/groups/ViewGroupInputsCoach';
import ViewGroupCoach from './pages/coaches/groups/ViewGroupCoach';
import ViewGroupAthlete from './pages/athletes/ViewGroupAthlete';
import Inputs from './pages/athletes/Inputs';
import CreateWorkoutGroup from './pages/athletes/CreateWorkoutGroup';
import Profile from './components/Profile';
import CoachRequests from './pages/athletes/CoachRequests';
import AthleteRequests from './pages/coaches/AthleteRequests';
import RequestCoaches from './pages/athletes/RequestCoaches';
import InputHistory from './pages/InputHistory';
import GroupHistory from './pages/GroupHistory';
//Root component used to render everything
Amplify.configure(awsConfig);

//Base page layout for all components
function BaseLayout(content: React.ReactElement): ComponentType<any>{
  return ()=>{
    return(
        <View className='bg-white flex-1'>
          {content}
        </View>
    ); 
  }
}

function UserLayout(content: React.ReactElement): ComponentType<any>{
  return ()=>{
    return(
      <>
        <ScrollView className='bg-white flex-1'>
          {content}
        </ScrollView>
        <Footer/>
      </>
    ); 
  }
}
//Directory allowing page navigation
const RootStack = createNativeStackNavigator({
  initialRouteName: 'SignIn',
  screenOptions: {
    headerShown: false
  },
  screens: {
    CreateAccount: BaseLayout(<CreateAccount/>),
    SignIn: BaseLayout(<SignIn/>),
    ConfirmEmail: BaseLayout(<ConfirmEmail/>),
    CoachGroups: UserLayout(<CoachGroups/>),
    AthleteGroups: UserLayout(<AthleteGroups/>),
    CoachProfile: UserLayout(<Profile/>),
    AthleteProfile: UserLayout(<Profile/>),
    CreateGroup: UserLayout(<CreateGroup/>),
    ViewGroupCoach: UserLayout(<ViewGroupCoach/>),
    AddAthlete: UserLayout(<AddAthlete/>),
    Athletes: UserLayout(<Athletes/>),
    Coaches: UserLayout(<Coaches/>),
    CoachRequests: UserLayout(<CoachRequests/>),
    AssignAthletes: UserLayout(<AssignAthletes/>),
    CreateWorkout: UserLayout(<CreateWorkout/>),
    Workouts: UserLayout(<Workouts/>),
    AssignWorkout: UserLayout(<AssignWorkout/>),
    ViewGroupInputsCoach: UserLayout(<ViewGroupInputsCoach/>),
    ViewGroupAthlete: UserLayout(<ViewGroupAthlete/>),
    Inputs: UserLayout(<Inputs/>),
    CreateWorkoutGroup: UserLayout(<CreateWorkoutGroup/>),
    AthleteRequests: UserLayout(<AthleteRequests/>),
    RequestCoaches: UserLayout(<RequestCoaches/>),
    InputHistory: UserLayout(<InputHistory/>),
    GroupHistory: UserLayout(<GroupHistory/>),
  },
});
const Navigation = createStaticNavigation(RootStack);

//Return the navigation stack as the app
export default function App() {
  return <Navigation />;
}