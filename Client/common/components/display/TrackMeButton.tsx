import { useState } from "react";
import { Pressable, Text, View, ActivityIndicator, LayoutChangeEvent } from "react-native";

const TrackMeButton = ({
  text,
  onPress,
  red,
  gray,
  className,
  removeTextOnLoading,
}: {
  text: string
  onPress: () => void | Promise<void>
  red?: boolean
  gray?: boolean
  className?: string
  removeTextOnLoading?: boolean
}) => {
  const [loading, setLoading] = useState(false);
  const [buttonWidth, setButtonWidth] = useState<number>(0);

  const handlePress = () => {
    const res = onPress();
    if (res instanceof Promise) {
      setLoading(true);
      res.finally(() => setLoading(false));
    }
  };

  const onLayout = (e: LayoutChangeEvent) => {
    if (!buttonWidth) {
      setButtonWidth(e.nativeEvent.layout.width);
    }
  };

  const bgColor = red
    ? "trackme-bg-red"
    : gray
    ? "trackme-bg-gray"
    : "trackme-bg-blue";
  const textColor = gray ? "text-gray-800" : "text-white";

  return (
    <Pressable
      onLayout={onLayout}
      onPress={loading ? undefined : handlePress}
      disabled={loading}
      className={`rounded-lg py-2 px-4 ${bgColor} ${className}`}
      style={buttonWidth ? { width: buttonWidth } : undefined}
    >
      {loading ? (
        <View className="flex-row items-center justify-center">
          <ActivityIndicator
            size="small"
            color={textColor === "text-white" ? "#ffffff" : "#4B5563"}
          />
          {!removeTextOnLoading && (
            <Text className={`text-center font-medium ml-2 ${textColor}`}>
              {text}
            </Text>
          )}
        </View>
      ) : (
        <Text className={`text-center font-medium ${textColor}`}>{text}</Text>
      )}
    </Pressable>
  );
};

export default TrackMeButton;