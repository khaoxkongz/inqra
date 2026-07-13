import type { Project, ProjectMember } from "./project.types";

const mockMembers = {
  designer: {
    id: "member-designer",
    displayName: "Design team member",
    avatarUrl: "https://github.com/shadcn.png",
    initials: "DS",
  },
  evilrabbit: {
    id: "member-evilrabbit",
    displayName: "evilrabbit",
    avatarUrl: "https://github.com/evilrabbit.png",
    initials: "ER",
  },
  maxleiter: {
    id: "member-maxleiter",
    displayName: "Max Leiter",
    avatarUrl: "https://github.com/maxleiter.png",
    initials: "ML",
  },
  shadcn: {
    id: "member-shadcn",
    displayName: "shadcn",
    avatarUrl: "https://github.com/shadcn.png",
    initials: "CN",
  },
} as const satisfies Record<string, ProjectMember>;

const coreProjectMembers = [
  mockMembers.shadcn,
  mockMembers.maxleiter,
  mockMembers.evilrabbit,
] as const;

const extendedProjectMembers = [
  ...coreProjectMembers,
  mockMembers.designer,
] as const;

export const mockProjects = [
  {
    id: "emergency-medicine-certification-registry",
    name: "ทะเบียนการรับรององค์กรและหลักสูตรการศึกษาหรือฝึกอบรมผู้ปฏิบัติการการให้ประกาศนียบัตรและบัตรประจำตัวผู้ปฏิบัติการ สถาบันการแพทย์ฉุกเฉินแห่งชาติ",
    teamName: "Business Dashboard - Data Wealth",
    status: "in-progress",
    startDate: "2025-01-15",
    endDate: "2025-02-22",
    taskCount: 500,
    isFavorite: true,
    members: extendedProjectMembers,
    additionalMemberCount: 3,
  },
  {
    id: "health-score-phase-2",
    name: "Health Score Phase 2",
    teamName: "Health",
    status: "in-progress",
    startDate: "2025-01-15",
    endDate: "2025-02-22",
    taskCount: 500,
    isFavorite: false,
    members: coreProjectMembers,
    additionalMemberCount: 0,
  },
  {
    id: "smart-hospitor-intern-doctor",
    name: "[Smart Hospitor] - Intern Doctor",
    teamName: "DHI",
    status: "completed",
    startDate: "2025-01-14",
    endDate: "2025-02-28",
    taskCount: 300,
    isFavorite: false,
    members: extendedProjectMembers,
    additionalMemberCount: 5,
  },
  {
    id: "csat-2",
    name: "Csat 2.0",
    teamName: "SQA",
    status: "completed",
    startDate: "2025-01-20",
    endDate: "2025-12-27",
    taskCount: 5200,
    isFavorite: true,
    members: extendedProjectMembers,
    additionalMemberCount: 3,
  },
  {
    id: "dhi-back-office",
    name: "DHI - Back Office",
    teamName: "DHI",
    status: "in-review",
    startDate: "2025-01-20",
    endDate: "2025-12-27",
    taskCount: 5200,
    isFavorite: false,
    members: extendedProjectMembers,
    additionalMemberCount: 0,
  },
] as const satisfies readonly Project[];

export function findMockProjectById(id: string): Project | undefined {
  return mockProjects.find((project) => project.id === id);
}
