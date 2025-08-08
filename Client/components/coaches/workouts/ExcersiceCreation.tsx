import { Text, TextInput, View } from "react-native";

const ExcerciseCreation: React.FC<{ excercise: any; setExcersies: React.Dispatch<React.SetStateAction<any[]>> }> = ({ excercise, setExcersies }) => {
  return (
    <View className="border my-3">
      <Text>Create Excercise</Text>
      {/** Name */}
      <TextInput value={excercise.name} onChangeText={text => {
        const updatedExcercise = { ...excercise, name: text };
        setExcersies((prev) => prev.map((ex) => (ex.id === excercise.id ? updatedExcercise : ex)));
      }} />
    </View>
  );
};

export default ExcerciseCreation;
