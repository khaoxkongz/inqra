import { z } from "zod/v4";

import { protectedProcedure, router } from "../index";
import {
  getProjectById,
  getProjectReferenceData,
  getProjects,
  softDeleteProject,
  updateProjectFavorite,
} from "../modules/project/project.service";

const projectIdInput = z.object({
  projectId: z.string().uuid(),
});

export const projectRouter = router({
  archive: protectedProcedure.input(projectIdInput).mutation(
    async ({ ctx, input }) =>
      await softDeleteProject(ctx.db, {
        projectId: input.projectId,
        userId: ctx.session.user.id,
      })
  ),
  byId: protectedProcedure.input(projectIdInput).query(
    async ({ ctx, input }) =>
      await getProjectById(ctx.db, {
        projectId: input.projectId,
        userId: ctx.session.user.id,
      })
  ),
  favorite: router({
    set: protectedProcedure
      .input(
        z.object({
          isFavorite: z.boolean(),
          projectId: z.string().uuid(),
        })
      )
      .mutation(
        async ({ ctx, input }) =>
          await updateProjectFavorite(ctx.db, {
            ...input,
            userId: ctx.session.user.id,
          })
      ),
  }),
  list: protectedProcedure
    .input(
      z.object({
        favoriteOnly: z.boolean().default(false),
        sort: z.enum(["latest", "oldest"]).default("latest"),
      })
    )
    .query(
      async ({ ctx, input }) =>
        await getProjects(ctx.db, {
          ...input,
          userId: ctx.session.user.id,
        })
    ),
  referenceData: protectedProcedure.query(
    async ({ ctx }) =>
      await getProjectReferenceData(ctx.db, ctx.session.user.id)
  ),
});
