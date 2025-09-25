import { createContext } from "react";
import { AccountType } from "../assets/constants/Enums";

export const AuthContext = createContext<AccountType>(AccountType.SignedOut);