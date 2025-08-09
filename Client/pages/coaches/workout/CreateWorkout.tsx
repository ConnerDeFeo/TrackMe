import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import ExcerciseCreation from "../../../components/coaches/workouts/ExcersiceCreation";
import Exercise from "../../../types/Excersise";

//Page for workout creation by coaches
const CreateWorkout = () => {

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [excersies, setExcersies] = useState<Array<Exercise>>([]);

  console.log(excersies)
  return (
    <View>
        <Text>Create workout</Text>
        <View className="border">
          <Text>Title</Text>
          <TextInput value={title} onChangeText={setTitle} />
        </View>
        <View className="border">
          <Text>Description</Text>
          <TextInput multiline value={description} onChangeText={setDescription} />
        </View>
        <View>
          {excersies.map((excersise, idx) => (
            <ExcerciseCreation key={idx} excercise={excersise} setExcersies={setExcersies} />
          ))}
          <Button title="Create Excercise" onPress={() => setExcersies([...excersies, {name: '', id: excersies.length}])} />
        </View>
    </View>
  );
};

export default CreateWorkout;

/**
 * test_workout = {
        "body": json.dumps({
            'coach_id': '123',
            'title': 'Test Workout',
            'description': 'This is a test workout',
            'excersies': [
                {
                    'name': 'Test name',
                    'sets': 3,
                    'reps': 10,
                    'excersiesParts': [
                        {
                            'distance': 100,
                            'measurement': 'meters'
                        },
                        {
                            'distance': 50,
                            'measurement': 'meters'
                        }
                    ],
                    "inputs":True
                },
                {
                    'name': 'Test name 2',
                    'sets': 2,
                    'reps': 15,
                    'excersiesParts': [
                        {
                            'distance': 200,
                            'measurement': 'meters'
                        }
                    ]
                },
                {
                    'name': 'Warm-up',
                }
            ]
        })
    }
 */