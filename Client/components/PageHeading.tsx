import { Image, Text, TouchableOpacity, View } from "react-native";
import { useNav } from "../hooks/useNav";

// Reusable page heading component with optional back button and add (+) button.
// Props:
//  - title: text shown centered in the header
//  - addFunction: if provided, renders a + icon that calls this on press
//  - goBack: when true, shows a back arrow that navigates to previous screen
const PageHeading = ({title, addFunction, goBack,}: { title: string; addFunction?: () => void; goBack?: boolean; }) => {
    const {goBack: handleGoBack} = useNav(); // Access navigation for goBack

    return (
        <View
            className="
                relative flex flex-row justify-between
                border-b border-gray-300 px-4 mt-[4rem]
                min-h-[2.75rem] pb-2 mb-4
            "
        >
            {/* Left area: Back button (optional) */}
            <View>
                {goBack && (
                    <TouchableOpacity onPress={handleGoBack}>
                        <Image source={require("../images/Back.png")} className="h-8 w-8" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Absolute centered title (stays centered even if side buttons differ in width) */}
            <View className="absolute left-0 right-0">
                <Text className="text-2xl font-bold self-center">{title}</Text>
            </View>

            {/* Right area: Add (+) button (optional) */}
            <View>
                {addFunction && (
                    <TouchableOpacity onPress={addFunction} className="right-4">
                        <Image
                            source={require("../images/Plus.png")}
                            className="h-5 w-5 m-1"
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default PageHeading;