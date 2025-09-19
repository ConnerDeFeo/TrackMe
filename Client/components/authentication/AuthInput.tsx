import { useState } from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";

/**
 * Default input component for create account and sign in pages
 * Supports both regular text input and password input with show/hide functionality
 */
const AuthInput = ( {value, setValue, placeholder, sensitive}:
    {value:string, setValue:React.Dispatch<React.SetStateAction<string>>, placeholder:string, sensitive?:boolean})=>{

    // State to control password visibility (only used when sensitive is true)
    const [hidePassword, setHidePassword] = useState<boolean>(sensitive?true:false);

    return(
        <View className="relative">
            {/* Main text input field */}
            <TextInput 
                value={value} 
                onChangeText={text => setValue(text)} 
                secureTextEntry={hidePassword} // Hide text when hidePassword is true
                className="text-xl p-1 bg-white rounded p-2"
                placeholder={placeholder}
            /> 
            {/* Show eye icon for password fields on=-ly */}
            {sensitive &&
                <TouchableOpacity className="absolute right-3 top-2" onPress={() => setHidePassword(!hidePassword)}>
                    {/* Eye icon to toggle password visibility */}
                    <Image source={require('../../images/Eye.png')} className="w-8 h-8" />
                    {/* Strike-through line when password is hidden */}
                    {hidePassword && <View className="absolute w-6 h-[0.15rem] bg-black rotate-45 top-[0.9rem] right-1"/>}
                </TouchableOpacity>
            }
        </View>
    );
}

export default AuthInput;