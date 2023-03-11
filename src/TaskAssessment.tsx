import { Pose } from "@tensorflow-models/pose-detection";
import { useState } from "react";
import { AssessmentType, calculateMetrics } from "./assessments/common";
import { Metric } from "./assessments/metrics";

// The source of truth!
const SUPPORTED_ASSESSMENT_TYPES = [
  "bilateral_stepdown_left",
  "bilateral_stepdown_right",
] as const;

interface TaskAssessmentProps {
  srcUri: string;
  poseData: Pose;
}

interface MetricsTableProps {
  metrics: Metric[];
}
const MetricsTable = ({ metrics }: MetricsTableProps) => {
  return (
    <table>
      <tbody>
        <tr>
          <th>Metric</th>
          <th>Score</th>
          <th>Grade</th>
        </tr>
        {metrics.map((m) => (
          <tr key={m.name}>
            <td>{m.name}</td>
            <td>{m.score}</td>
            <td>{m.grade}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// const getAssessmentComponent = (type: AssessmentType) => {
//   switch (type) {
//     case "bilateral_stepdown_left":
//       return TaskAssessmentBilteralStepdownLeft;
//     case "bilateral_stepdown_right":
//       return TaskAssessmentBilteralStepdownRight;
//     default:
//       throw Error(`Unsupported type: ${type}`);
//   }
// };

const TaskAssessment = ({ srcUri, poseData }: TaskAssessmentProps) => {
  const [selectedTask, setSelectedTask] = useState<AssessmentType>(
    "bilateral_stepdown_left"
  );
  return (
    <>
      <label htmlFor="task-select">Task Assessment</label>
      <select
        id="task-select"
        value={selectedTask}
        onChange={(event) => {
          setSelectedTask(event.target.value as AssessmentType);
        }}
      >
        {SUPPORTED_ASSESSMENT_TYPES.map((task) => (
          <option key={task} value={task}>
            {task}
          </option>
        ))}
      </select>
      {poseData.keypoints.length <= 0 ? (
        <p>Missing keypoints...</p>
      ) : (
        <MetricsTable metrics={calculateMetrics(selectedTask, poseData)} />
      )}
    </>
  );
};

export default TaskAssessment;
