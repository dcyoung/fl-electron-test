import { Pose } from "@tensorflow-models/pose-detection";
import {
  calculateAngleBetweenVectors,
  vecBetween,
  midPoint,
  sameSign,
} from "./math";
import { Metric } from "./metrics";
import { getKeypoints, KEYPOINT_NAMES } from "./pose";

/**
 *
 * @param poseData
 * @param angToleranceDeg : The maximum angular difference between a vertical line
 *  and the line drawn between the hip and the knee.
 * @returns
 */
const calculateHipStability = (
  poseData: Pose,
  isLeft: boolean,
  angToleranceDeg: number = 5
): Metric => {
  const [hip, knee, ank] = getKeypoints(
    poseData,
    isLeft
      ? [
          KEYPOINT_NAMES.LEFT_HIP,
          KEYPOINT_NAMES.LEFT_KNEE,
          KEYPOINT_NAMES.LEFT_ANKLE,
        ]
      : [
          KEYPOINT_NAMES.RIGHT_HIP,
          KEYPOINT_NAMES.RIGHT_KNEE,
          KEYPOINT_NAMES.RIGHT_ANKLE,
        ]
  );

  const vHipKnee = vecBetween(hip, knee);
  const vVertical = { x: 0, y: 1 };
  const deg = calculateAngleBetweenVectors(vHipKnee, vVertical);
  if (deg <= angToleranceDeg) {
    return { name: "HIP STABILITY", score: 2, grade: "ADEQUATE" };
  }

  // Check if the ankle is "inside"/center from the knee"
  const xDeltaKneeAnk = knee.x - ank.x;
  const xDeltaKneeHip = knee.x - hip.x;
  if (!sameSign(xDeltaKneeAnk, xDeltaKneeHip)) {
    return { name: "HIP STABILITY", score: 1, grade: "BORDERLINE" };
  }

  return { name: "HIP STABILITY", score: 0, grade: "INADEQUATE" };
};

const calculatePelvisStability = (poseData: Pose): Metric => {
  const [hipL, hipR] = getKeypoints(poseData, [
    KEYPOINT_NAMES.LEFT_HIP,
    KEYPOINT_NAMES.RIGHT_HIP,
  ]);
  const vHip2Hip = vecBetween(hipL, hipR);
  const vHoriz = { x: 1, y: 0 };
  const deg = calculateAngleBetweenVectors(vHip2Hip, vHoriz);
  if (deg >= 10) {
    return { name: "PELVIS STABILITY", score: 0, grade: "INADEQUATE" };
  }
  if (deg >= 6) {
    return { name: "PELVIS STABILITY", score: 1, grade: "BORDERLINE" };
  }
  return { name: "PELVIS STABILITY", score: 2, grade: "ADEQUATE" };
};

const calculateTrunkStability = (
  poseData: Pose,
  angToleranceDeg: number = 2
): Metric => {
  const [nose, hipL, hipR, earL, earR] = getKeypoints(poseData, [
    KEYPOINT_NAMES.NOSE,
    KEYPOINT_NAMES.LEFT_HIP,
    KEYPOINT_NAMES.RIGHT_HIP,
    KEYPOINT_NAMES.LEFT_EAR,
    KEYPOINT_NAMES.RIGHT_EAR,
  ]);

  const umbilicus = midPoint(hipL, hipR);
  const vTrunk = vecBetween(umbilicus, { x: umbilicus.x, y: 0 });
  const vUmbilicus2Nose = vecBetween(umbilicus, nose);

  if (
    calculateAngleBetweenVectors(vTrunk, vUmbilicus2Nose) <= angToleranceDeg
  ) {
    return { name: "TRUNK STABILITY", score: 2, grade: "ADEQUATE" };
  }

  // trunk line is outside the ears
  if (umbilicus.x < earR.x || umbilicus.x > earL.x) {
    return { name: "TRUNK STABILITY", score: 0, grade: "INADEQUATE" };
  }

  return { name: "TRUNK STABILITY", score: 1, grade: "BORDERLINE" };
};

const calculateHipStrategy = (poseData: Pose): Metric => {
  return { name: "HIP STRATEGY", score: 3, grade: "BORDERLINE" };
};

export const calculateMetricsBilateralStepdownLeft = (
  poseData: Pose
): Metric[] => {
  return [
    calculateHipStability(poseData, true),
    calculatePelvisStability(poseData),
    calculateTrunkStability(poseData),
    // calculateHipStrategy(poseData),
  ];
};

export const calculateMetricsBilateralStepdownRight = (
  poseData: Pose
): Metric[] => {
  return [
    calculateHipStability(poseData, false),
    calculatePelvisStability(poseData),
    calculateTrunkStability(poseData),
    // calculateHipStrategy(poseData),
  ];
};
