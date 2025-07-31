import { TextInput } from "react-native";

//Default input for create account and sign in pages
const AuthInput = (props:{value:string, setValue:React.Dispatch<React.SetStateAction<string>>, placeholder:string, sensitive?:boolean})=>{
    const {value,setValue,placeholder,sensitive} = props;

    return(
        <TextInput 
            value={value} 
            onChangeText={text => setValue(text)} 
            secureTextEntry={sensitive}
            className="text-xl p-1 border-b" 
            placeholder={placeholder}
        /> 
    );
}

export default AuthInput;