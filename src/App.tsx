import "./App.scss";
import { useFrameUri, usePoseData } from "./appState";
import DataUpload from "./DataUpload";
import PoseRefinement from "./PoseRefinement";
import TaskAssessment from "./TaskAssessment";

console.log(
  "[App.tsx]",
  `Hello world from Electron ${process.versions.electron}!`
);

function App() {
  const frameUri = useFrameUri();
  const poseData = usePoseData();
  return (
    <div>
      <h1>Test</h1>
      <div>
        {frameUri ? (
          <div style={{ width: "100%" }}>
            <div style={{ width: "50%", maxWidth: "50%", float: "left" }}>
              <PoseRefinement srcUri={frameUri} />
            </div>
            <div style={{ marginLeft: "50%", maxWidth: "50%" }}>
              <TaskAssessment srcUri={frameUri} poseData={poseData} />
            </div>
          </div>
        ) : (
          <DataUpload />
        )}
      </div>
    </div>
  );
}

export default App;
