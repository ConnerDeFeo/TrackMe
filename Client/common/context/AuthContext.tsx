import { createContext } from "react";
import { AccountType } from "../constants/Enums";

export const AuthContext = createContext<[AccountType, React.Dispatch<React.SetStateAction<AccountType>>]>([AccountType.SignedOut, () => {}]);
