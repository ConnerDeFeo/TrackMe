import { ActivityIndicator, View } from 'react-native';
import './global.css'
import { NavigationContainer, ParamListBase, RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateAccount from './pages/authentication/CreateAccount';
import { Amplify } from 'aws-amplify';
import awsConfig from './aws-config';
import ConfirmEmail from './pages/authentication/ConfirmEmail';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import SignIn from './pages/authentication/SignIn';
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
import MassInput from './pages/MassInput';
import UserService from './services/UserService';
import { AuthContext } from './common/context/AuthContext';
import { AccountType } from './common/constants/Enums';
import CoachFooter from './components/coaches/CoachFooter';
import AthleteFooter from './components/athletes/AthleteFooter';
import GroupSchedule from './pages/GroupSchedule';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import HeaderRightButton from './components/HeaderRightButton';
import GroupSettings from './pages/coaches/groups/GroupSettings';
//Root component used to render everything
Amplify.configure(awsConfig);

function ScrollViewWrapper(content: React.ReactElement): ComponentType<any>{
  return ()=>(
      <KeyboardAwareScrollView 
        className='bg-white flex-1' 
        showsHorizontalScrollIndicator={false} 
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        {content}
      </KeyboardAwareScrollView>
    ); 
  
}
const getRightButtonData = (route:RouteProp<ParamListBase, string>): { navigation: string; image: "plus" | "settings" } | null => {
  const routeName = route.name;
  switch(routeName) {
    case 'CoachGroups': return {
      navigation: 'CreateGroup',
      image: 'plus'
    };
    case 'WorkoutTemplates': return{
      navigation: 'CreateWorkoutTemplate',
      image: 'plus'
    };
    case 'ViewGroupCoach': return {
      navigation: 'GroupSettings',
      image: 'settings'
    };
    default: return null;
  }
};

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

const AthleteStack = createNativeStackNavigator();
const AthleteLayoutWrapper = () => {
  return (
    <>
      <AthleteStack.Navigator initialRouteName='AthleteGroups' screenOptions={({route, navigation})=> {
        const params = route.params;
        const rightButtonData = getRightButtonData(route);
        const state = navigation.getState();
        return{
          headerRight: rightButtonData ? ()=><HeaderRightButton onPress={() => navigation.navigate(rightButtonData.navigation,route.params)} image={rightButtonData.image} /> : ()=>null,
          title: getPageTitle(route.name, params),
          animation: state.index === 0 ? 'none' : 'default', // No animation on initial screen
        }
      }}>
        <AthleteStack.Screen name="AthleteGroups" options={{ title: "Groups" }} component={ScrollViewWrapper(<AthleteGroups />)} />
        <AthleteStack.Screen name="AthleteProfile" options={{ title: "Profile" }} component={ScrollViewWrapper(<Profile />)} />
        <AthleteStack.Screen name="Coaches" options={{ title: "Coaches" }} component={ScrollViewWrapper(<Coaches />)} />
        <AthleteStack.Screen name="CoachInvites" options={{ title: "Coach Invites" }} component={ScrollViewWrapper(<CoachInvites />)} />
        <AthleteStack.Screen name="ViewGroupAthlete" component={ScrollViewWrapper(<ViewGroupAthlete />)} />
        <AthleteStack.Screen name="Inputs" options={{ title: "Inputs" }} component={ScrollViewWrapper(<Inputs />)} />
        <AthleteStack.Screen name="CreateWorkoutGroup" options={{ title: "Create Workout Group" }} component={ScrollViewWrapper(<CreateWorkoutGroup />)} />
        <AthleteStack.Screen name="RequestCoaches" options={{ title: "Request Coaches" }} component={ScrollViewWrapper(<RequestCoaches />)} />
        <AthleteStack.Screen name="InputHistory" options={{ title: "Input History" }} component={ScrollViewWrapper(<InputHistory />)} />
        <AthleteStack.Screen name="MassInput" component={ScrollViewWrapper(<MassInput />)} />
        <AthleteStack.Screen name="GroupSchedule" options={{ title: "Schedule" }} component={ScrollViewWrapper(<GroupSchedule />)} />
      </AthleteStack.Navigator>
      <AthleteFooter />
    </>
  );
}

const CoachStack = createNativeStackNavigator();
const CoachLayoutWrapper = () => {
  return (
    <>
      <CoachStack.Navigator initialRouteName='CoachGroups' screenOptions={({route, navigation})=> {
        const params = route.params;
        const rightButtonData = getRightButtonData(route);
        const state = navigation.getState();
        return{
          headerRight: rightButtonData ? ()=><HeaderRightButton onPress={() => navigation.navigate(rightButtonData.navigation, route.params)} image={rightButtonData.image} /> : ()=>null,
          title: getPageTitle(route.name, params),
          animation: state.index === 0 ? 'none' : 'default', // No animation on initial screen
        }
      }}>
        <CoachStack.Screen name="CoachGroups" options={{ title: "Groups" }} component={ScrollViewWrapper(<CoachGroups />)} />
        <CoachStack.Screen name="CoachProfile" options={{ title: "Profile" }} component={ScrollViewWrapper(<Profile />)} />
        <CoachStack.Screen name="CreateGroup" options={{ title: "Create Group" }} component={ScrollViewWrapper(<CreateGroup />)} />
        <CoachStack.Screen name="ViewGroupCoach" component={ScrollViewWrapper(<ViewGroupCoach />)} />
        <CoachStack.Screen name="AddAthlete" options={{ title: "Add Athlete" }} component={ScrollViewWrapper(<AddAthlete />)} />
        <CoachStack.Screen name="Athletes" options={{ title: "Athletes" }} component={ScrollViewWrapper(<Athletes />)} />
        <CoachStack.Screen name="AssignAthletes" options={{ title: "Assign Athletes" }} component={ScrollViewWrapper(<AssignAthletes />)} />
        <CoachStack.Screen name="CreateWorkoutTemplate" options={{ title: "Create Workout Template" }} component={ScrollViewWrapper(<CreateWorkoutTemplate />)} />
        <CoachStack.Screen name="WorkoutTemplates" options={{ title: "Workout Templates" }} component={ScrollViewWrapper(<WorkoutTemplates />)} />
        <CoachStack.Screen name="AssignWorkout" options={{ title: "Assign Workout" }} component={ScrollViewWrapper(<AssignWorkout />)} />
        <CoachStack.Screen name="ViewGroupInputsCoach" component={ScrollViewWrapper(<ViewGroupInputsCoach />)} />
        <CoachStack.Screen name="AthleteRequests" options={{ title: "Athlete Requests" }} component={ScrollViewWrapper(<AthleteRequests />)} />
        <CoachStack.Screen name="CoachHistory" options={{ title: "Coach History" }} component={ScrollViewWrapper(<CoachHistory />)} />
        <CoachStack.Screen name="HistoricalData" component={ScrollViewWrapper(<HistoricalData />)} />
        <CoachStack.Screen name="AssignNewWorkout" options={{ title: "Assign Workout" }} component={ScrollViewWrapper(<AssignNewWorkout />)} />
        <CoachStack.Screen name="GroupSchedule" options={{ title: "Schedule" }} component={ScrollViewWrapper(<GroupSchedule />)} />
        <CoachStack.Screen name="GroupSettings" options={{ title: "Settings" }} component={ScrollViewWrapper(<GroupSettings />)} />
      </CoachStack.Navigator>
      <CoachFooter />
    </>
  );
}

const AuthStack = createNativeStackNavigator();
const AuthLayoutWrapper = () =>{
  return (
    <View className="flex-1 bg-white">
      <AuthStack.Navigator screenOptions={{ headerShown: false, animation:'none' }} initialRouteName='SignIn'>
        <AuthStack.Screen name="SignIn" component={SignIn} />
        <AuthStack.Screen name="CreateAccount" component={CreateAccount} />
        <AuthStack.Screen name="ConfirmEmail" component={ConfirmEmail} />
        <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
        <AuthStack.Screen name="ResetPassword" component={ResetPassword} />
      </AuthStack.Navigator>
    </View>
  );
}
//Return the navigation stack as the app
export default function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [accountType, setAccountType] = useState<AccountType>(AccountType.SignedOut);


  useEffect(() => {
    async function checkAuth() {
      const accountType = await UserService.getAccountType();
      if (accountType !== AccountType.SignedOut) {
        setAccountType(accountType);
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
    <AuthContext.Provider value={[accountType, setAccountType]}>
      <NavigationContainer>
          {accountType === AccountType.SignedOut ? (
            <AuthLayoutWrapper/>
          ) : (
            accountType === AccountType.Athlete ? (
              <AthleteLayoutWrapper/>
            ) : (
              <CoachLayoutWrapper/>
            )
          )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}