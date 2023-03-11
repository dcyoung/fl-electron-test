import { Pose } from "@tensorflow-models/pose-detection";

export const KEYPOINT_NAMES = {
  NOSE: "nose",
  LEFT_EYE: "left_eye",
  RIGHT_EYE: "right_eye",
  LEFT_EAR: "left_ear",
  RIGHT_EAR: "right_ear",
  LEFT_SHOULDER: "left_shoulder",
  RIGHT_SHOULDER: "right_shoulder",
  LEFT_ELBOW: "left_elbow",
  RIGHT_ELBOW: "right_elbow",
  LEFT_WRIST: "left_wrist",
  RIGHT_WRIST: "right_wrist",
  LEFT_HIP: "left_hip",
  RIGHT_HIP: "right_hip",
  LEFT_KNEE: "left_knee",
  RIGHT_KNEE: "right_knee",
  LEFT_ANKLE: "left_ankle",
  RIGHT_ANKLE: "right_ankle",
} as const;

export const getKeypoints = (poseData: Pose, names: string[]) => {
  const output = [];
  for (const name of names) {
    const kpt = poseData.keypoints.find((v) => v.name == name);
    if (kpt === undefined) {
      throw Error(`Missing keypoint: ${name}`);
    }
    output.push(kpt);
  }
  return output;
};
