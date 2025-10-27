import { InputType } from "../../constants/Enums";
import { InputBase } from "./InputBase";

export interface NoteInput extends InputBase {
    type: InputType.Note;
    note: string;
}