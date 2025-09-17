import { ScrollView, View } from 'react-native';
import './global.css'
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
import CreateWorkoutTemplate from './pages/coaches/workout/CreateWorkoutTemplate';
import WorkoutTemplates from './pages/coaches/workout/WorkoutTemplates';
import AssignWorkout from './pages/coaches/groups/AssignWorkout';
import ViewGroupInputsCoach from './pages/coaches/groups/ViewGroupInputsCoach';
import ViewGroupCoach from './pages/coaches/groups/ViewGroupCoach';
import ViewGroupAthlete from './pages/athletes/ViewGroupAthlete';
import Inputs from './pages/athletes/Inputs';
import CreateWorkoutGroup from './pages/athletes/CreateWorkoutGroup';
import Profile from './components/Profile';
import CoachInvites from './pages/athletes/CoachInvites';
import AthleteRequests from './pages/coaches/AthleteRequests';
import RequestCoaches from './pages/athletes/RequestCoaches';
import InputHistory from './pages/InputHistory';
import CoachHistory from './pages/coaches/CoachHistory';
import HistoricalData from './pages/coaches/HistoricalData';
import AssignNewWorkout from './pages/coaches/groups/AssignNewWorkout';
import { ComponentType } from 'react';
//Root component used to render everything
Amplify.configure(awsConfig);

function ScrollViewWrapper(content: React.ReactElement): ComponentType<any>{
  return ()=>(
      <>
        <ScrollView className='bg-white flex-1' showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      </>
    ); 
  
}


const UserStack = createNativeStackNavigator();
const UserLayoutWrapper = () =>{
  return (
    <View className='flex-1 bg-white'>
      <UserStack.Navigator screenOptions={{ headerShown: false }}>
        <UserStack.Screen name="CoachGroups" component={ScrollViewWrapper(<CoachGroups />)} />
        <UserStack.Screen name="AthleteGroups" component={ScrollViewWrapper(<AthleteGroups />)} />
        <UserStack.Screen name="CoachProfile" component={ScrollViewWrapper(<Profile />)} />
        <UserStack.Screen name="AthleteProfile" component={ScrollViewWrapper(<Profile />)} />
        <UserStack.Screen name="CreateGroup" component={ScrollViewWrapper(<CreateGroup />)} />
        <UserStack.Screen name="ViewGroupCoach" component={ScrollViewWrapper(<ViewGroupCoach />)} />
        <UserStack.Screen name="AddAthlete" component={ScrollViewWrapper(<AddAthlete />)} />
        <UserStack.Screen name="Athletes" component={ScrollViewWrapper(<Athletes />)} />
        <UserStack.Screen name="Coaches" component={ScrollViewWrapper(<Coaches />)} />
        <UserStack.Screen name="CoachInvites" component={ScrollViewWrapper(<CoachInvites />)} />
        <UserStack.Screen name="AssignAthletes" component={ScrollViewWrapper(<AssignAthletes />)} />
        <UserStack.Screen name="CreateWorkoutTemplate" component={ScrollViewWrapper(<CreateWorkoutTemplate />)} />
        <UserStack.Screen name="WorkoutTemplates" component={ScrollViewWrapper(<WorkoutTemplates />)} />
        <UserStack.Screen name="AssignWorkout" component={ScrollViewWrapper(<AssignWorkout />)} />
        <UserStack.Screen name="ViewGroupInputsCoach" component={ScrollViewWrapper(<ViewGroupInputsCoach />)} />
        <UserStack.Screen name="ViewGroupAthlete" component={ScrollViewWrapper(<ViewGroupAthlete />)} />
        <UserStack.Screen name="Inputs" component={ScrollViewWrapper(<Inputs />)} />
        <UserStack.Screen name="CreateWorkoutGroup" component={ScrollViewWrapper(<CreateWorkoutGroup />)} />
        <UserStack.Screen name="AthleteRequests" component={ScrollViewWrapper(<AthleteRequests />)} />
        <UserStack.Screen name="RequestCoaches" component={ScrollViewWrapper(<RequestCoaches />)} />
        <UserStack.Screen name="InputHistory" component={ScrollViewWrapper(<InputHistory />)} />
        <UserStack.Screen name="CoachHistory" component={ScrollViewWrapper(<CoachHistory />)} />
        <UserStack.Screen name="HistoricalData" component={ScrollViewWrapper(<HistoricalData />)} />
        <UserStack.Screen name="AssignNewWorkout" component={ScrollViewWrapper(<AssignNewWorkout />)} />
      </UserStack.Navigator>
      <Footer />
    </View>
  );
}

const AuthStack = createNativeStackNavigator();
const AuthLayoutWrapper = () =>{
  return (
    <View className="flex-1 bg-white">
      <AuthStack.Navigator screenOptions={{ headerShown: false }} initialRouteName='SignIn'>
        <AuthStack.Screen name="SignIn" component={SignIn} />
        <AuthStack.Screen name="CreateAccount" component={CreateAccount} />
        <AuthStack.Screen name="ConfirmEmail" component={ConfirmEmail} />
      </AuthStack.Navigator>
    </View>
  );
}

const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false
  },
  screens: {
    Auth: AuthLayoutWrapper,
    User: UserLayoutWrapper,
  },
});
const Navigation = createStaticNavigation(RootStack);

//Return the navigation stack as the app
export default function App() {
  return <Navigation />;
}