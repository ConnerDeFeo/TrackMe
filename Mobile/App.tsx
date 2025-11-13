import { Amplify } from 'aws-amplify';
import awsConfig from './aws-config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ComponentType, useEffect, useState } from 'react';
import { NavigationContainer, ParamListBase, RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import './global.css';
import { ActivityIndicator, View } from "react-native";
import AthleteFooter from './common/components/athletes/AthleteFooter';
import HeaderRightButton from './common/components/HeaderRightButton';
import CreateWorkoutGroup from './pages/athletes/CreateWorkoutGroup';
import RelationInvites from './pages/RelationInvites';
import Relations from './pages/Relations';
import MassInput from './pages/MassInput';
import TodayInputs from './pages/athletes/TodayInputs';
import HistoricalInputs from './pages/athletes/HistoricalInputs';
import Friends from './pages/Friends';
import History from './pages/History';
import HistoricalData from './pages/HistoricalData';
import CoachFooter from './common/components/coaches/CoachFooter';
import SignIn from './pages/authentication/SignIn';
import CreateAccount from './pages/authentication/CreateAccount';
import ConfirmEmail from './pages/authentication/ConfirmEmail';
import ForgotPassword from './pages/authentication/ForgotPassword';
import ResetPassword from './pages/authentication/ResetPassword';
import { AccountType } from './common/constants/Enums';
import TrackMeToast from './common/components/display/TrackMeToast';
import UserService from './services/UserService';
import { AuthContext } from './common/context/AuthContext';
import Toast from 'react-native-toast-message';
import PersonalProfile from './pages/PersonalProfile';
import OtherProfile from './pages/OtherProfile';
import Video from './pages/Video';
import UploadVideo from './pages/UploadVideo';


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

const getRightButtonData = (route:RouteProp<ParamListBase, string>): { navigation: string; image: "plus" | "settings" | "clipboard" } | null => {
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
    case 'Inputs': return {
      navigation: 'MassInput',
      image: 'clipboard'
    };
    case "Video": return {
      navigation: 'UploadVideo',
      image: 'plus'
    };
    default: return null;
  }
};

const getPageTitle = (routeName:string, params:any) => {
  switch(routeName) {
    case 'HistoricalData': return params.date;
    case 'ViewGroupCoach': return params.groupName;
    case 'ViewGroupAthlete': return params.groupName;
    case 'HistoricalInputs': return `Inputs (${params.date})`;
    default: return routeName;
  }
};

const AthleteStack = createNativeStackNavigator();
const AthleteLayoutWrapper = () => {
  const [currentRoute, setCurrentRoute] = useState<string>('Inputs');
  return (
    <>
      <AthleteStack.Navigator 
        initialRouteName='Inputs' 
        screenOptions={({route, navigation})=> {
          const params = route.params;
          const rightButtonData = getRightButtonData(route);
          const state = navigation.getState();
          return{
            headerRight: rightButtonData ? ()=><HeaderRightButton onPress={() => navigation.navigate(rightButtonData.navigation,route.params)} image={rightButtonData.image} /> : ()=>null,
            title: getPageTitle(route.name, params),
            animation: state.index === 0 ? 'none' : 'default', // No animation on initial screen
          }
        }}
        screenListeners={{
          state:(e) =>{
            const state = e.data.state;
            const currentRouteName = state.routes[state.index].name;
            setCurrentRoute(currentRouteName)
          }
        }}
      >
        <AthleteStack.Screen name="Profile" options={{ title: "Profile" }} component={ScrollViewWrapper(<PersonalProfile />)} />
        <AthleteStack.Screen name="OtherProfile" options={{ title: "" }} component={ScrollViewWrapper(<OtherProfile />)} />
        <AthleteStack.Screen name="Inputs" options={{ title: "Inputs" }} component={TodayInputs} />
        <AthleteStack.Screen name="HistoricalInputs" component={HistoricalInputs} />
        <AthleteStack.Screen name="CreateWorkoutGroup" options={{ title: "Create Workout Group" }} component={ScrollViewWrapper(<CreateWorkoutGroup />)} />
        <AthleteStack.Screen name="MassInput" component={ScrollViewWrapper(<MassInput />)} />
        <AthleteStack.Screen name="Relations" options={{ title: "Relations" }} component={ScrollViewWrapper(<Relations />)} />
        <AthleteStack.Screen name="RelationInvites" options={{ title: "Relation Invites" }} component={ScrollViewWrapper(<RelationInvites />)} />
        <AthleteStack.Screen name="Friends" options={{ title: "Friends" }} component={ScrollViewWrapper(<Friends />)} />
        <AthleteStack.Screen name="History" options={{ title: "History" }} component={History} />
        <AthleteStack.Screen name="HistoricalData" component={ScrollViewWrapper(<HistoricalData />)} />
        <AthleteStack.Screen name="Video" component={ScrollViewWrapper(<Video />)} />
        <AthleteStack.Screen name="UploadVideo" options={{ title: "Upload Video" }} component={ScrollViewWrapper(<UploadVideo />)} />
      </AthleteStack.Navigator>
      <AthleteFooter currentRoute={currentRoute}/>
    </>
  );
}

const CoachStack = createNativeStackNavigator();
const CoachLayoutWrapper = () => {
  const [currentRoute, setCurrentRoute] = useState<string>('History');
  return (
    <>
      <CoachStack.Navigator 
        initialRouteName='History' 
        screenOptions={({route, navigation})=> {
          const params = route.params;
          const rightButtonData = getRightButtonData(route);
          const state = navigation.getState();
          return{
            headerRight: rightButtonData ? ()=><HeaderRightButton onPress={() => navigation.navigate(rightButtonData.navigation, route.params)} image={rightButtonData.image} /> : ()=>null,
            title: getPageTitle(route.name, params),
            animation: state.index === 0 ? 'none' : 'default', // No animation on initial screen
          }
        }}
        screenListeners={{
          state:(e) =>{
            const state = e.data.state;
            const currentRouteName = state.routes[state.index].name;
            setCurrentRoute(currentRouteName)
          }
        }}
      >
        <CoachStack.Screen name="Profile" options={{ title: "Profile" }} component={ScrollViewWrapper(<PersonalProfile />)} />
        <CoachStack.Screen name="HistoricalData" component={ScrollViewWrapper(<HistoricalData />)} />
        <CoachStack.Screen name="Relations" options={{ title: "Relations" }} component={ScrollViewWrapper(<Relations />)} />
        <CoachStack.Screen name="RelationInvites" options={{ title: "Relation Invites" }} component={ScrollViewWrapper(<RelationInvites />)} />
        <CoachStack.Screen name="Friends" options={{ title: "Friends" }} component={ScrollViewWrapper(<Friends />)} />
        <CoachStack.Screen name="History" options={{ title: "History" }} component={History} />
      </CoachStack.Navigator>
      <CoachFooter currentRoute={currentRoute}/>
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
  const [awaitingAuthentication, setAwaitingAuthentication] = useState<boolean>(true);
  const [accountType, setAccountType] = useState<AccountType>(AccountType.SignedOut);

  const toastConfig = {
    success: (props: any) => (
      <TrackMeToast props={props} />
    ),
  };

  useEffect(() => {
    async function checkAuth() {
      const accountType = await UserService.getAccountType();
      if (accountType !== AccountType.SignedOut) {
        setAccountType(accountType);
      }
      setAwaitingAuthentication(false);
    }
    checkAuth();
  }, []);

  if (awaitingAuthentication) {
    return (
      <View className='flex-1 justify-center items-center'>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>  
      <AuthContext.Provider value={[accountType, setAccountType]}>
        {/* Keep NavigationContainer stable and isolated */}
        <View className="flex-1">
          <NavigationContainer>
            {accountType === AccountType.SignedOut ? (
              <AuthLayoutWrapper />
            ) : accountType === AccountType.Athlete ? (
              <AthleteLayoutWrapper />
            ) : (
              <CoachLayoutWrapper />
            )}
          </NavigationContainer>
        </View>
      </AuthContext.Provider>
      <Toast position='top' config={toastConfig} topOffset={110}/>
    </>
  );
}