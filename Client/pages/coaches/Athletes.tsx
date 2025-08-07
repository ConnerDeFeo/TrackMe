import { useState } from "react";
import { View, Text } from "react-native"

//All of a given coach's athletes
const Athletes = () => {
    const [athletes, setAthletes] = useState([]);
    return (
        <View>
            <Text>Athletes Page</Text>
        </View>
    );
}

export default Athletes;