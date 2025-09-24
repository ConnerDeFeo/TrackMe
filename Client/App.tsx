import { ActivityIndicator, ScrollView,View } from 'react-native';
import './global.css'
import { NavigationContainer } from '@react-navigation/native';
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
import AssignWorkout from './pages/coaches/workout/AssignWorkout';
import ViewGroupInputsCoach from './pages/coaches/groups/ViewGroupInputsCoach';
import ViewGroupCoach from './pages/coaches/groups/ViewGroupCoach';
import ViewGroupAthlete from './pages/athletes/ViewGroupAthlete';
import Inputs from './pages/athletes/Inputs';
import CreateWorkoutGroup from './pages/athletes/CreateWorkoutGroup';
import Profile from './components/Profile';
import CoachInvites from './pages/athletes/CoachInvites';
import AthleteRequests from './pages/coaches/AthleteRequests';
import RequestCoaches from './pages/athletes/RequestCoaches';
import InputHistory from './pages/athletes/InputHistory';
import CoachHistory from './pages/coaches/CoachHistory';
import HistoricalData from './pages/coaches/HistoricalData';
import AssignNewWorkout from './pages/coaches/workout/AssignNewWorkout';
import { ComponentType, useEffect, useState } from 'react';
import ForgotPassword from './pages/authentication/ForgotPassword';
import ResetPassword from './pages/authentication/ResetPassword';
import HeaderPlusButton from './components/HeaderPlusButton';
import { HeaderBackButton } from '@react-navigation/elements';
import MassInput from './pages/MassInput';
import UserService from './services/UserService';
//Root component used to render everything
Amplify.configure(awsConfig);

function ScrollViewWrapper(content: React.ReactElement): ComponentType<any>{
  return ()=>(
      <ScrollView className='bg-white flex-1' showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
        {content}
      </ScrollView>
    ); 
  
}
const getPlusButtonNavigationTarget = (routeName:string) => {
  switch(routeName) {
    case 'CoachGroups': return 'CreateGroup';
    case 'WorkoutTemplates': return 'CreateWorkoutTemplate';
    default: return null;
  }
};

const goBackFunctions = (routeName:string, navigation: any)=>{
  switch(routeName) {
    case 'ViewGroupCoach': return navigation.popTo("CoachGroups");
    default: return navigation.goBack();
  }
}

const getPageTitle = (routeName:string, params:any) => {
  switch(routeName) {
    case 'HistoricalData': return params.date;
    case 'ViewGroupCoach': return params.groupName;
    case 'ViewGroupAthlete': return params.groupName;
    case 'ViewGroupInputsCoach': return `${params.groupName} Inputs`;
    case 'MassInput': return `${params.groupName} Mass Input`;
    default: return routeName;
  }
}

const canGoBack = (routeName:string) => {
  const noBackButtonRoutes = ['CoachGroups', 'AthleteGroups', 'CoachProfile', 'AthleteProfile','Inputs', 'WorkoutTemplates','Athletes','Coaches','InputHistory','CoachHistory'];
  return !noBackButtonRoutes.includes(routeName);
}
const UserStack = createNativeStackNavigator();
const UserLayoutWrapper = () => {
  return (
    <View className='flex-1 bg-white'>
      <UserStack.Navigator screenOptions={({route, navigation})=> {
        const params = route.params;
        const plusTarget = getPlusButtonNavigationTarget(route.name);
        const canGoBackFlag = canGoBack(route.name);
        return{
          headerRight: plusTarget ? ()=><HeaderPlusButton onPress={() => navigation.navigate(plusTarget)} /> : ()=>null,
          headerLeft: canGoBackFlag ? ()=><HeaderBackButton onPress={()=>goBackFunctions(route.name, navigation)}/> : ()=>null,
          headerBackVisible: false,
          title: getPageTitle(route.name, params),
        }
      }}>
        <UserStack.Screen name="CoachGroups" options={{ title: "Groups" }} component={ScrollViewWrapper(<CoachGroups />)} />
        <UserStack.Screen name="AthleteGroups" options={{ title: "Groups" }} component={ScrollViewWrapper(<AthleteGroups />)} />
        <UserStack.Screen name="CoachProfile" options={{ title: "Profile" }} component={ScrollViewWrapper(<Profile />)} />
        <UserStack.Screen name="AthleteProfile" options={{ title: "Profile" }} component={ScrollViewWrapper(<Profile />)} />
        <UserStack.Screen name="CreateGroup" options={{ title: "Create Group" }} component={ScrollViewWrapper(<CreateGroup />)} />
        <UserStack.Screen name="ViewGroupCoach" component={ScrollViewWrapper(<ViewGroupCoach />)} />
        <UserStack.Screen name="AddAthlete" options={{ title: "Add Athlete" }} component={ScrollViewWrapper(<AddAthlete />)} />
        <UserStack.Screen name="Athletes" options={{ title: "Athletes" }} component={ScrollViewWrapper(<Athletes />)} />
        <UserStack.Screen name="Coaches" options={{ title: "Coaches" }} component={ScrollViewWrapper(<Coaches />)} />
        <UserStack.Screen name="CoachInvites" options={{ title: "Coach Invites" }} component={ScrollViewWrapper(<CoachInvites />)} />
        <UserStack.Screen name="AssignAthletes" options={{ title: "Assign Athletes" }} component={ScrollViewWrapper(<AssignAthletes />)} />
        <UserStack.Screen name="CreateWorkoutTemplate" options={{ title: "Create Workout Template" }} component={ScrollViewWrapper(<CreateWorkoutTemplate />)} />
        <UserStack.Screen name="WorkoutTemplates" options={{ title: "Workout Templates" }} component={ScrollViewWrapper(<WorkoutTemplates />)} />
        <UserStack.Screen name="AssignWorkout" options={{ title: "Assign Workout" }} component={ScrollViewWrapper(<AssignWorkout />)} />
        <UserStack.Screen name="ViewGroupInputsCoach" component={ScrollViewWrapper(<ViewGroupInputsCoach />)} />
        <UserStack.Screen name="ViewGroupAthlete" component={ScrollViewWrapper(<ViewGroupAthlete />)} />
        <UserStack.Screen name="Inputs" options={{ title: "Inputs" }} component={ScrollViewWrapper(<Inputs />)} />
        <UserStack.Screen name="CreateWorkoutGroup" options={{ title: "Create Workout Group" }} component={ScrollViewWrapper(<CreateWorkoutGroup />)} />
        <UserStack.Screen name="AthleteRequests" options={{ title: "Athlete Requests" }} component={ScrollViewWrapper(<AthleteRequests />)} />
        <UserStack.Screen name="RequestCoaches" options={{ title: "Request Coaches" }} component={ScrollViewWrapper(<RequestCoaches />)} />
        <UserStack.Screen name="InputHistory" options={{ title: "Input History" }} component={ScrollViewWrapper(<InputHistory />)} />
        <UserStack.Screen name="CoachHistory" options={{ title: "Coach History" }} component={ScrollViewWrapper(<CoachHistory />)} />
        <UserStack.Screen name="HistoricalData" component={ScrollViewWrapper(<HistoricalData />)} />
        <UserStack.Screen name="AssignNewWorkout" options={{ title: "Assign Workout" }} component={ScrollViewWrapper(<AssignNewWorkout />)} />
        <UserStack.Screen name="MassInput" component={ScrollViewWrapper(<MassInput />)} />
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
        <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
        <AuthStack.Screen name="ResetPassword" component={ResetPassword} />
      </AuthStack.Navigator>
    </View>
  );
}

const RootStack = createNativeStackNavigator();
//Return the navigation stack as the app
export default function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);


  useEffect(() => {
    async function checkAuth() {
      const userId = await UserService.getUserId();
      if (userId) {
        setAuthenticated(true);
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  if (loading) {
    return (
      <View className='flex-1 justify-center items-center'>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {authenticated ? (
          <RootStack.Screen name="User" component={UserLayoutWrapper} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthLayoutWrapper} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}