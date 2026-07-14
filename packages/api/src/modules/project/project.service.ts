import type { createDb } from "@inqra/db";
import { TRPCError } from "@trpc/server";

import {
  archiveProject,
  listProjectReferenceData,
  listProjects,
  setProjectFavorite,
  type ProjectSort,
} from "./project.repository";

export const FAVORITE_PROJECT_LIMIT = 5;

type Database = ReturnType<typeof createDb>;

export const getProjects = async (
  database: Database,
  input: {
    favoriteOnly: boolean;
    sort: ProjectSort;
    userId: string;
  }
) => {
  const result = await listProjects(database, input);

  return { ...result, favoriteLimit: FAVORITE_PROJECT_LIMIT };
};

export const getProjectById = async (
  database: Database,
  input: { projectId: string; userId: string }
) => {
  const result = await listProjects(database, {
    favoriteOnly: false,
    projectId: input.projectId,
    sort: "latest",
    userId: input.userId,
  });
  const project = result.items[0];

  if (!project) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Project not found",
    });
  }

  return project;
};

export const getProjectReferenceData = async (
  database: Database,
  userId: string
) => await listProjectReferenceData(database, userId);

export const updateProjectFavorite = async (
  database: Database,
  input: { isFavorite: boolean; projectId: string; userId: string }
) => {
  const result = await setProjectFavorite(
    database,
    input,
    FAVORITE_PROJECT_LIMIT
  );

  if (result.status === "not-found") {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Project not found",
    });
  }

  if (result.status === "limit-reached") {
    throw new TRPCError({
      code: "CONFLICT",
      message: `Favorite project limit is ${FAVORITE_PROJECT_LIMIT}`,
    });
  }

  return result;
};

export const softDeleteProject = async (
  database: Database,
  input: { projectId: string; userId: string }
) => {
  const isArchived = await archiveProject(database, input);

  if (!isArchived) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You cannot delete this project",
    });
  }

  return { id: input.projectId };
};
