import { Pose } from "@tensorflow-models/pose-detection";
import { Metric } from "./metrics";
import {
  calculateMetricsBilateralStepdownLeft,
  calculateMetricsBilateralStepdownRight,
} from "./step_down";

export type AssessmentType =
  | "bilateral_stepdown_left"
  | "bilateral_stepdown_right";

export interface PoseBasedAssessment {
  calculateMetrics: (poseData: Pose) => Metric[];
}

export const calculateMetrics = (task: AssessmentType, poseData: Pose) => {
  switch (task) {
    case "bilateral_stepdown_left":
      return calculateMetricsBilateralStepdownLeft(poseData);
    case "bilateral_stepdown_right":
      return calculateMetricsBilateralStepdownRight(poseData);
    default:
      throw Error(`Unsupported type: ${task}`);
  }
};
