import { type Exercise } from "./Exercise";

export type Section = {
  name?: string;
  minSets: number;
  maxSets?: number;
  exercises?: Exercise[];
  id?: string; // Optional ID for identifying the section
};

