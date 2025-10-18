import { InputType } from "../../constants/Enums";
import { InputBase } from "./InputBase";

export interface TimeInput extends InputBase {
    type: InputType.Run;
    distance: number; // in meters
    time: string; // in seconds
}