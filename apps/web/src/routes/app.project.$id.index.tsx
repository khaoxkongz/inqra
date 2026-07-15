import {
  createFileRoute,
  retainSearchParams,
  stripSearchParams,
} from "@tanstack/react-router";
import { z } from "zod/v4";

const defaultSearchValues = {
  view: "list" as const,
};

const searchSchema = z.object({
  view: z
    .literal(["list", "board", "details"])
    .default(defaultSearchValues.view),
});

export const Route = createFileRoute("/app/project/$id/")({
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
});
