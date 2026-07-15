import {
  createFileRoute,
  retainSearchParams,
  stripSearchParams,
} from "@tanstack/react-router";
import { z } from "zod/v4";

const defaultSearchValues = {
  view: "list" as const,
  sort: "latest" as const,
  isFavorite: false,
};

const searchSchema = z.object({
  view: z.literal(["list", "grid"]).default(defaultSearchValues.view),
  sort: z.literal(["latest", "oldest"]).default(defaultSearchValues.sort),
  isFavorite: z.boolean().default(defaultSearchValues.isFavorite),
});

export const Route = createFileRoute("/app/")({
  loaderDeps: ({ search }) => ({
    favoriteOnly: search.isFavorite,
    sort: search.sort,
  }),
  loader: async ({ context, deps }) =>
    await context.queryClient.ensureQueryData(
      context.trpc.project.list.queryOptions(deps)
    ),
  search: {
    middlewares: [
      retainSearchParams(["view", "sort", "isFavorite"]),
      stripSearchParams(defaultSearchValues),
    ],
  },
  validateSearch: searchSchema,
});
