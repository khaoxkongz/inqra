import type { createDb } from "@inqra/db";
import { user } from "@inqra/db/schema/auth";
import {
  company,
  organizationUnit,
  project,
  projectFavorite,
  projectMember,
  projectPermissionGrant,
  team,
  teamMember,
} from "@inqra/db/schema/project";
import {
  and,
  asc,
  count,
  desc,
  eq,
  inArray,
  isNotNull,
  isNull,
  or,
  sql,
} from "drizzle-orm";

const PROJECT_MEMBER_PREVIEW_LIMIT = 4;

type Database = ReturnType<typeof createDb>;

export type ProjectSort = "latest" | "oldest";

export interface ListProjectsInput {
  favoriteOnly: boolean;
  projectId?: string;
  sort: ProjectSort;
  userId: string;
}

const createInitials = (name: string): string =>
  Array.from(name.trim()).slice(0, 2).join("").toUpperCase();

export const listProjects = async (
  database: Database,
  input: ListProjectsInput
) => {
  const accessibleProjectMember = and(
    eq(projectMember.projectId, project.id),
    eq(projectMember.userId, input.userId)
  );
  const currentUserFavorite = and(
    eq(projectFavorite.projectId, project.id),
    eq(projectFavorite.userId, input.userId)
  );
  const orderBy =
    input.sort === "oldest" ? asc(project.createdAt) : desc(project.createdAt);

  const projectRows = await database
    .select({
      companyName: company.name,
      createdAt: project.createdAt,
      endDate: project.endDate,
      id: project.id,
      isFavorite: sql<boolean>`${projectFavorite.projectId} is not null`,
      name: project.name,
      startDate: project.startDate,
      status: project.status,
      teamName: team.name,
      type: project.type,
    })
    .from(project)
    .leftJoin(team, eq(team.id, project.teamId))
    .leftJoin(company, eq(company.id, project.companyId))
    .leftJoin(projectMember, accessibleProjectMember)
    .leftJoin(projectFavorite, currentUserFavorite)
    .where(
      and(
        isNull(project.deletedAt),
        or(
          eq(project.ownerUserId, input.userId),
          isNotNull(projectMember.userId)
        ),
        input.favoriteOnly ? isNotNull(projectFavorite.projectId) : undefined,
        input.projectId ? eq(project.id, input.projectId) : undefined
      )
    )
    .orderBy(orderBy);

  const projectIds = projectRows.map((projectRow) => projectRow.id);
  const memberRows =
    projectIds.length === 0
      ? []
      : await database
          .select({
            image: user.image,
            name: user.name,
            projectId: projectMember.projectId,
            userId: user.id,
          })
          .from(projectMember)
          .innerJoin(user, eq(user.id, projectMember.userId))
          .where(inArray(projectMember.projectId, projectIds))
          .orderBy(asc(projectMember.joinedAt));

  const membersByProject = new Map<
    string,
    Array<{
      avatarUrl: string;
      displayName: string;
      id: string;
      initials: string;
    }>
  >();

  for (const memberRow of memberRows) {
    const members = membersByProject.get(memberRow.projectId) ?? [];
    members.push({
      avatarUrl: memberRow.image ?? "",
      displayName: memberRow.name,
      id: memberRow.userId,
      initials: createInitials(memberRow.name),
    });
    membersByProject.set(memberRow.projectId, members);
  }

  const items = projectRows.map((projectRow) => {
    const members = membersByProject.get(projectRow.id) ?? [];

    return {
      additionalMemberCount: Math.max(
        members.length - PROJECT_MEMBER_PREVIEW_LIMIT,
        0
      ),
      companyName: projectRow.companyName,
      createdAt: projectRow.createdAt.toISOString(),
      endDate: projectRow.endDate,
      id: projectRow.id,
      isFavorite: projectRow.isFavorite,
      members: members.slice(0, PROJECT_MEMBER_PREVIEW_LIMIT),
      name: projectRow.name,
      startDate: projectRow.startDate,
      status: projectRow.status,
      taskCount: 0,
      teamName: projectRow.teamName ?? "ไม่ระบุทีม",
      type: projectRow.type,
    };
  });

  const [favoriteSummary] = await database
    .select({ value: count() })
    .from(projectFavorite)
    .innerJoin(project, eq(project.id, projectFavorite.projectId))
    .where(
      and(eq(projectFavorite.userId, input.userId), isNull(project.deletedAt))
    );

  return {
    favoriteCount: favoriteSummary?.value ?? 0,
    items,
    totalProjects: items.length,
    totalTasks: items.reduce((total, item) => total + item.taskCount, 0),
  };
};

export const listProjectReferenceData = async (
  database: Database,
  userId: string
) => {
  const teams = await database
    .select({
      id: team.id,
      name: team.name,
      organizationUnitId: team.organizationUnitId,
    })
    .from(team)
    .innerJoin(teamMember, eq(teamMember.teamId, team.id))
    .where(eq(teamMember.userId, userId))
    .orderBy(asc(team.name));
  const organizationUnitIds = teams.flatMap((teamItem) =>
    teamItem.organizationUnitId ? [teamItem.organizationUnitId] : []
  );

  if (organizationUnitIds.length === 0) {
    return { companies: [], organizationUnits: [], teams };
  }

  const teamOrganizationUnits = await database
    .select({ companyId: organizationUnit.companyId })
    .from(organizationUnit)
    .where(inArray(organizationUnit.id, organizationUnitIds));
  const companyIds = [
    ...new Set(teamOrganizationUnits.map((unit) => unit.companyId)),
  ];

  const [companies, organizationUnits] = await Promise.all([
    database
      .select({ id: company.id, name: company.name })
      .from(company)
      .where(inArray(company.id, companyIds))
      .orderBy(asc(company.name)),
    database
      .select({
        companyId: organizationUnit.companyId,
        id: organizationUnit.id,
        name: organizationUnit.name,
        parentId: organizationUnit.parentId,
        type: organizationUnit.type,
      })
      .from(organizationUnit)
      .where(inArray(organizationUnit.companyId, companyIds))
      .orderBy(asc(organizationUnit.name)),
  ]);

  return { companies, organizationUnits, teams };
};

export type SetFavoriteResult =
  | { favoriteCount: number; isFavorite: boolean; status: "updated" }
  | { favoriteCount: number; isFavorite: false; status: "limit-reached" }
  | { favoriteCount: number; isFavorite: boolean; status: "not-found" };

export const setProjectFavorite = async (
  database: Database,
  input: { isFavorite: boolean; projectId: string; userId: string },
  favoriteLimit: number
): Promise<SetFavoriteResult> =>
  await database.transaction(async (transaction) => {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtext(${input.userId}))`
    );

    const [accessibleProject] = await transaction
      .select({ id: project.id })
      .from(project)
      .leftJoin(
        projectMember,
        and(
          eq(projectMember.projectId, project.id),
          eq(projectMember.userId, input.userId)
        )
      )
      .where(
        and(
          eq(project.id, input.projectId),
          isNull(project.deletedAt),
          or(
            eq(project.ownerUserId, input.userId),
            isNotNull(projectMember.userId)
          )
        )
      )
      .limit(1);

    const [favoriteSummary] = await transaction
      .select({ value: count() })
      .from(projectFavorite)
      .innerJoin(project, eq(project.id, projectFavorite.projectId))
      .where(
        and(eq(projectFavorite.userId, input.userId), isNull(project.deletedAt))
      );
    const favoriteCount = favoriteSummary?.value ?? 0;

    if (!accessibleProject) {
      return {
        favoriteCount,
        isFavorite: false,
        status: "not-found",
      };
    }

    const [existingFavorite] = await transaction
      .select({ projectId: projectFavorite.projectId })
      .from(projectFavorite)
      .where(
        and(
          eq(projectFavorite.projectId, input.projectId),
          eq(projectFavorite.userId, input.userId)
        )
      )
      .limit(1);

    if (!input.isFavorite) {
      if (existingFavorite) {
        await transaction
          .delete(projectFavorite)
          .where(
            and(
              eq(projectFavorite.projectId, input.projectId),
              eq(projectFavorite.userId, input.userId)
            )
          );
      }

      return {
        favoriteCount: Math.max(favoriteCount - (existingFavorite ? 1 : 0), 0),
        isFavorite: false,
        status: "updated",
      };
    }

    if (existingFavorite) {
      return {
        favoriteCount,
        isFavorite: true,
        status: "updated",
      };
    }

    if (favoriteCount >= favoriteLimit) {
      return {
        favoriteCount,
        isFavorite: false,
        status: "limit-reached",
      };
    }

    await transaction.insert(projectFavorite).values({
      projectId: input.projectId,
      userId: input.userId,
    });

    return {
      favoriteCount: favoriteCount + 1,
      isFavorite: true,
      status: "updated",
    };
  });

export const archiveProject = async (
  database: Database,
  input: { projectId: string; userId: string }
): Promise<boolean> => {
  const manageableProjectMember = and(
    eq(projectMember.projectId, project.id),
    eq(projectMember.userId, input.userId),
    eq(projectMember.isManager, true)
  );
  const manageAllGrant = and(
    eq(projectPermissionGrant.projectId, project.id),
    eq(projectPermissionGrant.userId, input.userId),
    eq(projectPermissionGrant.action, "manage-all")
  );

  const [manageableProject] = await database
    .select({ id: project.id })
    .from(project)
    .leftJoin(projectMember, manageableProjectMember)
    .leftJoin(projectPermissionGrant, manageAllGrant)
    .where(
      and(
        eq(project.id, input.projectId),
        isNull(project.deletedAt),
        or(
          eq(project.ownerUserId, input.userId),
          isNotNull(projectMember.userId),
          isNotNull(projectPermissionGrant.userId)
        )
      )
    )
    .limit(1);

  if (!manageableProject) {
    return false;
  }

  const archivedProjects = await database
    .update(project)
    .set({ deletedAt: new Date(), deletedByUserId: input.userId })
    .where(and(eq(project.id, input.projectId), isNull(project.deletedAt)))
    .returning({ id: project.id });

  return archivedProjects.length > 0;
};
