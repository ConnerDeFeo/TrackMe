import { InputType } from "../../constants/Enums";
import type { InputBase } from "./InputBase";

export interface RestInput extends InputBase {
    type: InputType.Rest;
    restTime: number;
}