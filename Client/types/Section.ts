import { Exercise } from "./Exercise";

type Section = {
  name: string;
  sets?: number;
  exercises?: Exercise[];
};

export default Section;
