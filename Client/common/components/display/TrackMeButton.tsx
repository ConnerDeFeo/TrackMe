import { useState } from "react";
import { Pressable, Text, View, ActivityIndicator, LayoutChangeEvent } from "react-native";

// Reusable button component with optional loading state and color variants
const TrackMeButton = ({
  text,                 // Label text for the button
  onPress,              // Callback when the button is pressed
  red,                  // Optional flag to render red background
  gray,                 // Optional flag to render gray background
  className,            // Additional tailwind or custom classes
}: {
  text: string;
  onPress: () => void | Promise<void>;
  red?: boolean;
  gray?: boolean;
  className?: string;
}) => {
  // Local loading state to prevent double taps and show spinner
  const [loading, setLoading] = useState(false);
  // Store measured button width to keep a fixed size during loading
  const [buttonWidth, setButtonWidth] = useState<number>(0);

  // Handle press logic, detect Promise to toggle loading state
  const handlePress = () => {
    const result = onPress();
    if (result instanceof Promise) {
      setLoading(true);
      result.finally(() => setLoading(false));
    }
  };

  // Measure the button width on first layout for consistent sizing
  const onLayout = (e: LayoutChangeEvent) => {
    if (!buttonWidth) {
      setButtonWidth(e.nativeEvent.layout.width);
    }
  };

  // Determine background and text colors based on props
  const bgColor = red
    ? "trackme-bg-red"
    : gray
    ? "trackme-bg-gray"
    : "trackme-bg-blue";
  const textColor = gray ? "text-gray-800" : "text-white";

  return (
    <Pressable
      onLayout={onLayout}
      // Disable tap when loading
      onPress={loading ? undefined : handlePress}
      disabled={loading}
      className={`rounded-lg py-2 px-4 ${className} ${bgColor} ${loading ? "opacity-70" : "opacity-100"}`}
      // Apply measured width to avoid layout shifts when spinner appears
      style={buttonWidth ? { width: buttonWidth } : undefined}
    >
      {loading ? (
        // Show spinner with optional text if removeTextOnLoading is false
        <View className="flex-row items-center justify-center">
          <ActivityIndicator
            size="small"
            color={textColor === "text-white" ? "#ffffff" : "#4B5563"}
          />
        </View>
      ) : (
        // Default button label when not loading
        <Text className={`text-center font-medium ${textColor}`}>
          {text}
        </Text>
      )}
    </Pressable>
  );
};

export default TrackMeButton;