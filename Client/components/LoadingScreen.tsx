import React from 'react';
import { View, ActivityIndicator, Modal } from 'react-native';

const LoadingScreen = ({ visible = false }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/40 justify-center items-center">
        <View className="p-5 bg-black/70 rounded-2xl">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </View>
    </Modal>
  );
};

export default LoadingScreen;