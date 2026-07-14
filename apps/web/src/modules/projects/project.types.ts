import type { AppRouter } from "@inqra/api/routers/index";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type Project = RouterOutputs["project"]["byId"];
export type ProjectMember = Project["members"][number];
export type ProjectStatus = Project["status"];
