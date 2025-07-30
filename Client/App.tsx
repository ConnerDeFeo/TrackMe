import { SafeAreaView } from 'react-native';
import './global.css'
import Setup from './pages/Setup';
import { createStaticNavigation, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ComponentType } from 'react';
import CreateAccount from './pages/CreateAccount';
import SignIn from './pages/SignIn';

function BaseLayout(content: React.ReactElement): ComponentType<any>{
  return ()=>{
    return(
      <SafeAreaView className='bg-white flex-1'>
        {content}
      </SafeAreaView>
    ); 
  }
}

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screenOptions: {
    headerShown: false
  },
  screens: {
    Home: BaseLayout(<Setup/>),
    CreateAccount: BaseLayout(<CreateAccount/>),
    SignIn: BaseLayout(<SignIn/>)
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}

