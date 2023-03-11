import { ipcRenderer } from "electron";
import { useState } from "react";
import { useAppStateActions, useFrameUri } from "./appState";
import VideoFramePicker from "./VideoFramePicker";

const isImage = (uri: string) => {
  switch (uri.toLowerCase().split(".").pop()) {
    case "jpeg":
    case "jpg":
    case "png":
      return true;
    default:
      return false;
  }
};

interface DataUploadProps {}
const DataUpload = ({}: DataUploadProps) => {
  const frameUri = useFrameUri();
  const { setFrameUri } = useAppStateActions();
  const [videoUri, setVideoUri] = useState("");
  return (
    <>
      {frameUri ? (
        <></>
      ) : // <img width={600} src={`atom://${frameUri}`} />
      videoUri ? (
        <VideoFramePicker videoUri={videoUri} />
      ) : (
        <button
          onClick={(e) => {
            ipcRenderer.invoke("app:on-fs-dialog-open").then((v) => {
              if (v === undefined || !v) {
                return;
              }
              if (isImage(v)) {
                setFrameUri(v);
              } else {
                setVideoUri(v);
              }
            });
          }}
        >
          Upload Image or Video File
        </button>
      )}
    </>
  );
};

export default DataUpload;
