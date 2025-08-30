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
//Root component used to render everything
Amplify.configure(awsConfig);

const layouts = {
  'athlete': [['Groups', 'AthleteGroups'], ['Inputs', 'Inputs'], ['Coaches', 'Coaches'], ['Profile', 'AthleteProfile']],
  'coach': [['Groups', 'CoachGroups'], ['Workouts', 'Workouts'], ['Athletes', 'Athletes'], ['Profile', 'CoachProfile']]
}

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

function UserLayout(content: React.ReactElement, userType: 'athlete' | 'coach'): ComponentType<any>{
  return ()=>{
    return(
      <>
        <ScrollView className='bg-white flex-1'>
          {content}
        </ScrollView>
        <Footer buttons={layouts[userType]} />
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
    CoachGroups: UserLayout(<CoachGroups/>, 'coach'),
    AthleteGroups: UserLayout(<AthleteGroups/>, 'athlete'),
    CoachProfile: UserLayout(<Profile/>, 'coach'),
    AthleteProfile: UserLayout(<Profile/>, 'athlete'),
    CreateGroup: UserLayout(<CreateGroup/>, 'coach'),
    ViewGroupCoach: UserLayout(<ViewGroupCoach/>, 'coach'),
    AddAthlete: UserLayout(<AddAthlete/>, 'coach'),
    Athletes: UserLayout(<Athletes/>, 'coach'),
    Coaches: UserLayout(<Coaches/>, 'athlete'),
    CoachRequests: UserLayout(<CoachRequests/>, 'athlete'),
    AssignAthletes: UserLayout(<AssignAthletes/>, 'coach'),
    CreateWorkout: UserLayout(<CreateWorkout/>, 'coach'),
    Workouts: UserLayout(<Workouts/>, 'coach'),
    AssignWorkout: UserLayout(<AssignWorkout/>, 'coach'),
    ViewGroupInputsCoach: UserLayout(<ViewGroupInputsCoach/>, 'coach'),
    ViewGroupAthlete: UserLayout(<ViewGroupAthlete/>, 'athlete'),
    Inputs: UserLayout(<Inputs/>, 'athlete'),
    CreateWorkoutGroup: UserLayout(<CreateWorkoutGroup/>, 'athlete'),
    AthleteRequests: UserLayout(<AthleteRequests/>, 'coach'),
    RequestCoaches: UserLayout(<RequestCoaches/>, 'athlete'),
  },
});
const Navigation = createStaticNavigation(RootStack);

//Return the navigation stack as the app
export default function App() {
  return <Navigation />;
}