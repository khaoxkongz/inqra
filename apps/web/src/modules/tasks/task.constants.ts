import type {
  TaskStatus,
  TaskStatusFilter,
  TaskWorkspaceView,
} from "./task.types";

export const TASK_STATUS_OPTIONS = [
  { value: "not-started", label: "ยังไม่ได้เริ่ม" },
  { value: "in-progress", label: "กำลังดำเนินการ" },
  { value: "in-review", label: "อยู่ระหว่างตรวจสอบ" },
  { value: "changes-requested", label: "ปฏิเสธ/แก้ไข" },
  { value: "paused", label: "พักชั่วคราว" },
  { value: "completed", label: "เสร็จสิ้น" },
  { value: "failed", label: "ไม่สำเร็จ" },
  { value: "canceled", label: "ยกเลิก" },
] as const satisfies readonly { value: TaskStatus; label: string }[];

export const TASK_STATUS_FILTERS = [
  { value: "all", label: "ทั้งหมด" },
  ...TASK_STATUS_OPTIONS,
] as const satisfies readonly { value: TaskStatusFilter; label: string }[];

export const TASK_STATUS_LABELS = TASK_STATUS_OPTIONS.map(
  (option) => option.label
);

const TASK_WORKSPACE_VIEWS = new Set<TaskWorkspaceView>([
  "list",
  "board",
  "details",
]);

export function getTaskStatusLabel(status: TaskStatus): string {
  return (
    TASK_STATUS_OPTIONS.find((option) => option.value === status)?.label ??
    status
  );
}

export function getTaskStatusFromLabel(label: string): TaskStatus | undefined {
  return TASK_STATUS_OPTIONS.find((option) => option.label === label)?.value;
}

export function isTaskStatusFilter(value: string): value is TaskStatusFilter {
  return (
    value === "all" ||
    TASK_STATUS_OPTIONS.some((option) => option.value === value)
  );
}

export function isTaskWorkspaceView(value: string): value is TaskWorkspaceView {
  return TASK_WORKSPACE_VIEWS.has(value as TaskWorkspaceView);
}
