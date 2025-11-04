import { InputType } from "../../../constants/Enums";
import NoteDisplay from "./NoteDisplay";
import RestDisplay from "./RestDisplay";
import TimeDistanceDisplay from "./TimeDistanceDisplay";

const InputDisplay = ({input, selected}: {input: any, selected?: boolean}) => {
    switch (input.type) {
        case InputType.Run:
            return <TimeDistanceDisplay distance={input.distance} time={input.time} selected={selected} />;
        case InputType.Rest:
            return <RestDisplay restTime={input.restTime} selected={selected} />;
        case InputType.Note:
            return <NoteDisplay note={input.note} selected={selected} />;
        default:
            return null;
    }
}

export default InputDisplay;