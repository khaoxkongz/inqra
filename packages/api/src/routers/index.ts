import { protectedProcedure, publicProcedure, router } from "../index";
import { projectRouter } from "./project";
import { todoRouter } from "./todo";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => "OK"),
  privateData: protectedProcedure.query(({ ctx }) => ({
    message: "This is private",
    user: ctx.session.user,
  })),
  project: projectRouter,
  todo: todoRouter,
});
export type AppRouter = typeof appRouter;
