
"use client";

import { useRouter } from "next/navigation";
import TaskDetailsContent from "@components/components/tasks/TaskDetailsContent";
import ModalWrapper from "@components/components/ui/ModalWrapper";

export default function TaskDetailsPage({ params }) {
  const { projectId, taskId } = params;
  const router = useRouter();

  return (
    <ModalWrapper onClose={() => router.push(`/projects/${projectId}`)}>
      <TaskDetailsContent projectId={projectId} taskId={taskId} />
    </ModalWrapper>
  );
}
