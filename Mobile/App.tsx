import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Testing SVG</Text>
      <Svg height="100" width="100">
        <Circle cx="50" cy="50" r="40" stroke="blue" strokeWidth="2.5" fill="green" />
      </Svg>
    </View>
  );
}