import AsyncStorage from '@react-native-async-storage/async-storage';
// Store data
const storeData = async (key:string, value:string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

// Retrieve data
const getData = async (key:string) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error('Error retrieving data:', error);
  }
};

// Remove data
const removeData = async (key:string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
  }
};

export default {
  storeData,
  getData,
  removeData
};