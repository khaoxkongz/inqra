import {
  DocumentValidationIcon,
  Home05Icon,
  MoreVerticalIcon,
  SubnodeAddIcon,
  Upload01Icon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Badge } from "@inqra/ui/components/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@inqra/ui/components/breadcrumb";
import { Button } from "@inqra/ui/components/button";

import type { Project } from "../project.types";
import {
  formatNumber,
  PROJECT_NAME_MAX_LENGTH,
  truncateText,
} from "../project.utils";
import { ProjectStatusBadge } from "./project-status-badge";
import { Link } from "@tanstack/react-router";

export function ProjectDetailHeader({ project }: { project: Project }) {
  const projectName = truncateText(project.name, PROJECT_NAME_MAX_LENGTH);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink
              render={<Link to="/app" />}
              aria-label="กลับไปหน้ารวมโปรเจกต์"
              className="[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            >
              <HugeiconsIcon icon={Home05Icon} className="size-5" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <Badge variant="team">
                <span className="bg-linear-to-b from-[hsla(144_77%_32%/1)] to-[hsla(135_47%_58%/1)] bg-clip-text text-transparent">
                  {projectName}
                </span>
              </Badge>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}

export function ProjectOverview({ project }: { project: Project }) {
  return (
    <section className="grid grid-cols-2 items-end-safe gap-2">
      <div className="grid auto-rows-auto gap-3">
        <h1>{truncateText(project.name, PROJECT_NAME_MAX_LENGTH)}</h1>

        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 [&_svg]:size-5">
            <HugeiconsIcon icon={DocumentValidationIcon} />
            <span>{formatNumber(project.taskCount)}</span>
          </div>

          <div className="flex items-center gap-1.5 [&_svg]:size-5">
            <HugeiconsIcon icon={SubnodeAddIcon} />
            <span>8 Subtasks</span>
          </div>

          <ProjectStatusBadge status={project.status} />
        </div>
      </div>

      <div className="flex items-center gap-2 place-self-end-safe">
        <Button type="button" variant="outline">
          <HugeiconsIcon icon={Upload01Icon} data-icon="inline-start" />
          <span>อัปโหลดไฟล์</span>
        </Button>

        <Button type="button" variant="outline">
          <HugeiconsIcon icon={UserMultipleIcon} data-icon="inline-start" />
          <span>จัดการสมาชิก</span>
        </Button>

        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label="การทำงานเพิ่มเติม"
        >
          <HugeiconsIcon icon={MoreVerticalIcon} />
        </Button>
      </div>
    </section>
  );
}
