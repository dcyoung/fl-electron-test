import { ipcRenderer } from "electron";
import { useRef } from "react";
import { useAppStateActions } from "./appState";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

interface VideoFramePickerProps {
  videoUri: string;
}
const VideoFramePicker = ({ videoUri }: VideoFramePickerProps) => {
  const { setFrameUri } = useAppStateActions();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  return (
    <>
      <video
        ref={videoRef}
        width={600}
        src={`atom://${videoUri}`}
        controls
        controlsList={
          "noplay nopause novolume nofullscreen nodownload noremoteplayback noplaybackrate"
        }
        disablePictureInPicture
        disableRemotePlayback
        muted
        autoPlay={false}
      />
      <canvas ref={canvasRef} hidden />
      <button
        onClick={() => {
          if (!videoRef.current || !canvasRef.current) {
            return;
          }
          var w = videoRef.current.videoWidth;
          var h = videoRef.current.videoHeight;

          canvasRef.current.width = w;
          canvasRef.current.height = h;
          const ctx = canvasRef.current.getContext("2d");
          if (!ctx) {
            throw Error("Failed to retrieve context");
          }
          ctx.drawImage(videoRef.current, 0, 0, w, h);
          canvasRef.current.toBlob((blob: Blob | null) => {
            if (!blob) {
              throw Error("Failed to convert canvas to blob.");
            }
            ipcRenderer.invoke("app:get-temp-dir-path").then((tmpDir) => {
              const dst = `${tmpDir}/${uuidv4()}.jpg`;
              blob.arrayBuffer().then((buf) => {
                fs.writeFileSync(dst, Buffer.from(buf));
                setFrameUri(dst);
              });
            });
          }, "JPEG");
        }}
      >
        Use Frame
      </button>
    </>
  );
};

export default VideoFramePicker;
