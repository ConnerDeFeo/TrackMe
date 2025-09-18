import { TextInput, TouchableOpacity, View } from "react-native";

//Default input for create account and sign in pages
const AuthInput = ( {value, setValue, placeholder, sensitive}:
    {value:string, setValue:React.Dispatch<React.SetStateAction<string>>, placeholder:string, sensitive?:boolean})=>{

    return(
        <View>
            <TextInput 
                value={value} 
                onChangeText={text => setValue(text)} 
                secureTextEntry={sensitive}
                className="text-xl p-1 bg-white rounded p-2"
                placeholder={placeholder}
            /> 
            <TouchableOpacity className="absolute right-3 top-3">
                
            </TouchableOpacity>
        </View>
    );
}

export default AuthInput;