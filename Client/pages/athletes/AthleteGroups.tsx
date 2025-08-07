import { Text, View } from "react-native";
import GeneralService from "../../services/GeneralService";
import { useEffect, useState } from "react";
import Groups from "../../components/groups/Groups";

//Athlete view when they are looking at all ther groups
const AthleteGroups = () => {

  return (
    <View className="mt-10 w-[85%] mx-auto">
      <Groups />
    </View>
  );
};

export default AthleteGroups;