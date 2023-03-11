import create from "zustand";
import { Pose } from "@tensorflow-models/pose-detection";

interface IAppState {
  frameUri: string;
  poseData: Pose;
  actions: {
    setFrameUri: (uri: string) => void;
    setPoseData: (pose: Pose) => void;
  };
}

const useAppState = create<IAppState>((set, get) => ({
  frameUri: "",
  poseData: { keypoints: [] },
  actions: {
    setFrameUri: (uri: string) =>
      set((state) => {
        return {
          frameUri: uri,
          poseData: { keypoints: [] },
        };
      }),
    setPoseData: (pose: Pose) =>
      set((state) => {
        return {
          poseData: pose,
        };
      }),
  },
}));

export const useFrameUri = () => useAppState((state) => state.frameUri);
export const usePoseData = () => useAppState((state) => state.poseData);
export const useAppStateActions = () => useAppState((state) => state.actions);
