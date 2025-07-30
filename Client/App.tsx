import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import TestComponent from './pages/testing';
import './global.css'

export default function App() {
  return (
    <View style={styles.container}>
      <TestComponent/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
