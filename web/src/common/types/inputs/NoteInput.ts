import { InputType } from "../../constants/Enums";
import type { InputBase } from "./InputBase";

export interface NoteInput extends InputBase {
    type: InputType.Note;
    note: string;
}