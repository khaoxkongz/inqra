import { Badge } from "@inqra/ui/components/badge";

import type { ProjectStatus } from "../project.types";

const projectStatusPresentation = {
  canceled: {
    label: "ยกเลิก",
    className: "bg-red-50 text-red-600",
  },
  completed: {
    label: "เสร็จสิ้น",
    className: "bg-[hsla(102_100%_94%/1)] text-[hsla(100_77%_44%/1)]",
  },
  "in-progress": {
    label: "กำลังดำเนินการ",
    className: "bg-[hsla(32_100%_94%/1)] text-[hsla(40_100%_50%/1)]",
  },
  "in-review": {
    label: "อยู่ระหว่างตรวจสอบ",
    className: "bg-[hsla(209_100%_94%/1)] text-[hsla(209_100%_50%/1)]",
  },
  "not-started": {
    label: "ยังไม่เริ่ม",
    className: "bg-slate-100 text-slate-600",
  },
} as const satisfies Record<
  ProjectStatus,
  { label: string; className: string }
>;

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const presentation = projectStatusPresentation[status];

  return (
    <Badge variant="secondary" className={presentation.className}>
      {presentation.label}
    </Badge>
  );
}
