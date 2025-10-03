import { InputType } from "../../assets/constants/Enums";
import { InputBase } from "./InputBase";

export interface RestInput extends InputBase {
    type: InputType.Rest;
    restTime: number;
}