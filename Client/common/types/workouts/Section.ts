import { Exercise } from "./Exercise";

type Section = {
  name?: string;
  minSets: number;
  maxSets?: number;
  exercises?: Exercise[];
};

export default Section;
