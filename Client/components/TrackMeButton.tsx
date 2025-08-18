import { Button } from "react-native";

const TrackMeButton: React.FC<{ title: string, onPress: () => void, color?: string }> = ({ title, onPress, color }) => {
  return (
    <Button title={title} onPress={onPress} color={color} />
  );
};

export default TrackMeButton;
