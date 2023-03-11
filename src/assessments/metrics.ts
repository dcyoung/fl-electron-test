export interface Metric {
  name: string;
  score: number;
  grade: "ADEQUATE" | "BORDERLINE" | "INADEQUATE";
}
