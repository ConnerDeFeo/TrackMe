import { Button } from "react-native";

const TrackMeButton: React.FC<{ title: string, onPress: () => void }> = ({ title, onPress }) => {
  return (
    <Button title={title} onPress={onPress} />
  );
};

export default TrackMeButton;
