import { type Exercise } from "./Exercise";

export type Section = {
  name?: string;
  minSets: number;
  maxSets?: number;
  exercises?: Exercise[];
};

