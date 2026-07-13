export type TaskStatus =
  | "not-started"
  | "in-progress"
  | "in-review"
  | "changes-requested"
  | "paused"
  | "completed"
  | "failed"
  | "canceled";

export type TaskStatusFilter = "all" | TaskStatus;

export type TaskWorkspaceView = "list" | "board" | "details";

export type TaskMember = {
  id: string;
  displayName: string;
  avatarUrl: string;
  initials: string;
};

export type Task = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  submittedAt: string | null;
  approvedAt: string | null;
  owners: readonly TaskMember[];
  operators: readonly TaskMember[];
  additionalOperatorCount: number;
  status: TaskStatus;
  subtaskCount: number;
  isFlagged: boolean;
};
