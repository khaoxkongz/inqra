import {
  createFileRoute,
  notFound,
  retainSearchParams,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router";
import { z } from "zod/v4";

import {
  ProjectDetailHeader,
  ProjectOverview,
} from "@/modules/projects/components/project-detail-header";
import { findMockProjectById } from "@/modules/projects/project.fixtures";
import { ProjectTasksTable } from "@/modules/tasks/components/project-tasks-table";
import type { TaskWorkspaceView } from "@/modules/tasks/task.types";

const defaultSearchValues = {
  view: "list" as const,
};

const searchSchema = z.object({
  view: z
    .literal(["list", "board", "details"])
    .default(defaultSearchValues.view),
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { view } = Route.useSearch();
  const navigate = useNavigate({ from: "/app/project/$id" });
  const project = findMockProjectById(id);

  if (!project) {
    throw notFound();
  }

  const projectId = project.id;

  function handleViewChange(nextView: TaskWorkspaceView) {
    navigate({
      to: "/app/project/$id",
      params: { id: projectId },
      search: (previousSearch) => ({
        ...previousSearch,
        view: nextView,
      }),
    });
  }

  return (
    <>
      <ProjectDetailHeader project={project} />
      <main className="grid auto-rows-auto items-start gap-4 p-4">
        <ProjectOverview project={project} />
        <ProjectTasksTable view={view} onViewChange={handleViewChange} />
      </main>
    </>
  );
}

export const Route = createFileRoute("/app/project/$id")({
  search: {
    middlewares: [
      retainSearchParams(["view"]),
      stripSearchParams(defaultSearchValues),
    ],
  },
  validateSearch: searchSchema,
  component: RouteComponent,
  notFoundComponent: () => <div>404 Not found.</div>,
});
