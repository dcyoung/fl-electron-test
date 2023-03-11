import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
// import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import { useEffect, useRef, useState } from "react";
import { useAppStateActions, usePoseData } from "./appState";

tf.setBackend("webgl");

const detector = await poseDetection.createDetector(
  poseDetection.SupportedModels.MoveNet,
  {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
    // modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    // minPoseScore: 0.75,
  }
);

interface PoseRefinementProps {
  srcUri: string;
}
const PoseRefinement = ({ srcUri }: PoseRefinementProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const poseData = usePoseData();
  const { setPoseData } = useAppStateActions();

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const img = new Image();
    img.src = `atom://${srcUri}`;
    img.onload = (v) => {
      canvasRef.current.width = img.width;
      canvasRef.current.height = img.height;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) {
        throw Error("Bad context");
      }
      ctx.drawImage(img, 0, 0);

      const fontSize = Math.round(
        (canvasRef.current.width * canvasRef.current.height) ** (1 / 2) / 80
      );
      ctx.lineWidth = 2;
      ctx.strokeStyle = "white";
      ctx.font = `${fontSize}px "Segoe UI"`;
      if (!poseData || poseData.keypoints.length <= 0) {
        console.log("NO Keypoints...");
        return;
      }
      for (const kpt of poseData.keypoints) {
        //   console.log(kpt);
        ctx.fillStyle = "black";
        ctx.fillText(
          `${Math.round(100 * kpt.score)}% ${kpt.name}`,
          kpt.x + 1,
          kpt.y + 1
        );
        ctx.fillStyle = "white";
        ctx.fillText(
          `${Math.round(100 * kpt.score)}% ${kpt.name}`,
          kpt.x,
          kpt.y
        );
      }
      ctx.stroke();

      const connectParts = (parts: string[], color: string) => {
        ctx.strokeStyle = color;
        ctx.beginPath();
        for (let i = 0; i < parts.length; i++) {
          const part = poseData.keypoints.find((a) => a.name === parts[i]);
          if (part) {
            if (i === 0) ctx.moveTo(part.x, part.y);
            else ctx.lineTo(part.x, part.y);
          }
        }
        ctx.stroke();
      };
      connectParts(["nose", "left_eye", "right_eye", "nose"], "#99FFFF");
      connectParts(["right_shoulder", "right_elbow", "right_wrist"], "#99CCFF");
      connectParts(["left_shoulder", "left_elbow", "left_wrist"], "#99CCFF");
      connectParts(["right_hip", "right_knee", "right_ankle"], "#9999FF");
      connectParts(["left_hip", "left_knee", "left_ankle"], "#9999FF");
      connectParts(
        [
          "right_shoulder",
          "left_shoulder",
          "left_hip",
          "right_hip",
          "right_shoulder",
        ],
        "#9900FF"
      );
    };
  }, [canvasRef, srcUri, poseData]);

  return (
    <>
      <button
        onClick={() => {
          detector.estimatePoses(canvasRef.current).then((res) => {
            console.log(res);
            if (res.length > 0) {
              setPoseData(res[0]);
            } else {
              setPoseData({ keypoints: [] });
            }
          });
        }}
      >
        Infer Pose
      </button>
      {poseData.keypoints.length <= 0 && <p>No pose data.</p>}
      <br />
      <canvas ref={canvasRef} style={{ maxWidth: "100%" }} />
    </>
  );
};

export default PoseRefinement;
