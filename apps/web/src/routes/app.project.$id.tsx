import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  getRouteApi,
  retainSearchParams,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router";
import { z } from "zod/v4";

import {
  ProjectDetailHeader,
  ProjectOverview,
} from "@/modules/projects/components/project-detail-header";
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

const route = getRouteApi("/app/project/$id");

function RouteComponent() {
  const { id } = route.useParams();
  const { view } = route.useSearch();
  const navigate = useNavigate({ from: "/app/project/$id" });
  const { trpc } = route.useRouteContext();
  const { data: project } = useSuspenseQuery(
    trpc.project.byId.queryOptions({ projectId: id })
  );

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
  loader: async ({ context, params }) =>
    await context.queryClient.ensureQueryData(
      context.trpc.project.byId.queryOptions({ projectId: params.id })
    ),
  search: {
    middlewares: [
      retainSearchParams(["view"]),
      stripSearchParams(defaultSearchValues),
    ],
  },
  validateSearch: searchSchema,
  component: RouteComponent,
  notFoundComponent: () => <div>404 Not found.</div>,
  pendingComponent: () => <div>Loading...</div>,
});
