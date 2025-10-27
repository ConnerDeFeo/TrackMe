import { InputType } from "./Enums";

export const Variables = {
    meters: "meters",
    daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    distanceOptions: [50,100,150,200,250,300,350,400,450,500,600,800,1000],
    inputs:{
        quickInputs:{
            LeftInputTextField:{
                headers:{
                    [InputType.Run]: "Distance (meters)",
                    [InputType.Rest]: "Minutes",
                    [InputType.Note]: "Note"
                },
                placeHolders:{
                    [InputType.Run]: "0",
                    [InputType.Rest]: "Mins",
                    [InputType.Note]: "Enter your note here"
                }
            },
            rightInputTextFeild:{
                headers:{
                    [InputType.Run]: "Time (Seconds)",
                    [InputType.Rest]: "Seconds",
                    [InputType.Note]: "Note"
                },
                placeHolders:{
                    [InputType.Run]: "0.00",
                    [InputType.Rest]: "Secs",
                    [InputType.Note]: "Enter your note here"
                }
            }
        }
    }
};
