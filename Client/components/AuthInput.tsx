import { TextInput } from "react-native";
import { useEffect, useState } from "react";

//Default input for create account and sign in pages
const AuthInput = (props:{value:string, setValue:React.Dispatch<React.SetStateAction<string>>, placeholder:string})=>{
    const {value,setValue,placeholder} = props;

    return(
        <TextInput 
            value={value} 
            onChangeText={text => setValue(text)} 
            className="text-4xl p-1 border-b" 
            placeholder={placeholder}
        /> 
    );
}

export default AuthInput;