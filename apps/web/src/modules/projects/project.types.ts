export type ProjectStatus = "completed" | "in-progress" | "in-review";

export type ProjectMember = {
  id: string;
  displayName: string;
  avatarUrl: string;
  initials: string;
};

export type Project = {
  id: string;
  name: string;
  teamName: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  taskCount: number;
  isFavorite: boolean;
  members: readonly ProjectMember[];
  additionalMemberCount: number;
};
