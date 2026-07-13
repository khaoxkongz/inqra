import type { Task, TaskMember } from "./task.types";

const mockTaskMembers = {
  evilrabbit: {
    id: "task-member-evilrabbit",
    displayName: "evilrabbit",
    avatarUrl: "https://github.com/evilrabbit.png",
    initials: "ER",
  },
  maxleiter: {
    id: "task-member-maxleiter",
    displayName: "Max Leiter",
    avatarUrl: "https://github.com/maxleiter.png",
    initials: "ML",
  },
  shadcn: {
    id: "task-member-shadcn",
    displayName: "shadcn",
    avatarUrl: "https://github.com/shadcn.png",
    initials: "CN",
  },
} as const satisfies Record<string, TaskMember>;

const taskOwners = [mockTaskMembers.shadcn, mockTaskMembers.maxleiter] as const;
const taskOperators = [...taskOwners, mockTaskMembers.evilrabbit] as const;

const sharedTaskDetails = {
  name: "ระบบลงทะเบียนสถานประกอบการ และชำระเงินค่าธรรมเนียม",
  startDate: "2025-11-25",
  endDate: "2025-11-30",
  owners: taskOwners,
  operators: taskOperators,
  additionalOperatorCount: 3,
} as const;

export const mockTasks = [
  {
    ...sharedTaskDetails,
    id: "task-001",
    submittedAt: null,
    approvedAt: null,
    status: "not-started",
    subtaskCount: 3,
    isFlagged: true,
  },
  {
    ...sharedTaskDetails,
    id: "task-002",
    submittedAt: null,
    approvedAt: null,
    status: "not-started",
    subtaskCount: 3,
    isFlagged: false,
  },
  {
    ...sharedTaskDetails,
    id: "task-003",
    submittedAt: null,
    approvedAt: null,
    status: "in-progress",
    subtaskCount: 3,
    isFlagged: false,
  },
  {
    ...sharedTaskDetails,
    id: "task-004",
    submittedAt: "2025-11-28",
    approvedAt: null,
    status: "in-review",
    subtaskCount: 0,
    isFlagged: true,
  },
  {
    ...sharedTaskDetails,
    id: "task-005",
    submittedAt: "2025-11-28",
    approvedAt: "2025-11-28",
    status: "changes-requested",
    subtaskCount: 0,
    isFlagged: true,
  },
  {
    ...sharedTaskDetails,
    id: "task-006",
    submittedAt: null,
    approvedAt: null,
    status: "paused",
    subtaskCount: 0,
    isFlagged: true,
  },
  {
    ...sharedTaskDetails,
    id: "task-007",
    submittedAt: "2025-11-28",
    approvedAt: "2025-11-28",
    status: "completed",
    subtaskCount: 0,
    isFlagged: true,
  },
  {
    ...sharedTaskDetails,
    id: "task-008",
    submittedAt: "2025-11-28",
    approvedAt: "2025-11-28",
    status: "failed",
    subtaskCount: 3,
    isFlagged: false,
  },
  {
    ...sharedTaskDetails,
    id: "task-009",
    submittedAt: null,
    approvedAt: null,
    status: "canceled",
    subtaskCount: 3,
    isFlagged: false,
  },
  {
    ...sharedTaskDetails,
    id: "task-010",
    submittedAt: null,
    approvedAt: null,
    status: "in-progress",
    subtaskCount: 3,
    isFlagged: false,
  },
] as const satisfies readonly Task[];
