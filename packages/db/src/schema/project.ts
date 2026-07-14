import { relations, sql } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import {
  boolean,
  check,
  date,
  index,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "./auth";

export const organizationUnitType = pgEnum("organization_unit_type", [
  "business-line",
  "division",
  "section",
  "unit",
]);

export const projectType = pgEnum("project_type", ["internal", "outsource"]);

export const projectStatus = pgEnum("project_status", [
  "not-started",
  "in-progress",
  "in-review",
  "completed",
  "canceled",
]);

export const projectPermissionAction = pgEnum("project_permission_action", [
  "manage-all",
  "create-task",
  "manage-general",
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

export const company = pgTable(
  "company",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("company_name_unique").on(table.name)]
);

export const organizationUnit = pgTable(
  "organization_unit",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => company.id, { onDelete: "restrict" }),
    parentId: uuid("parent_id").references(
      (): AnyPgColumn => organizationUnit.id,
      { onDelete: "restrict" }
    ),
    type: organizationUnitType("type").notNull(),
    name: text("name").notNull(),
    ...timestamps,
  },
  (table) => [
    index("organization_unit_company_id_idx").on(table.companyId),
    index("organization_unit_parent_id_idx").on(table.parentId),
    uniqueIndex("organization_unit_parent_name_unique").on(
      table.companyId,
      table.parentId,
      table.name
    ),
  ]
);

export const team = pgTable(
  "team",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationUnitId: uuid("organization_unit_id").references(
      () => organizationUnit.id,
      { onDelete: "set null" }
    ),
    name: text("name").notNull(),
    ...timestamps,
  },
  (table) => [
    index("team_organization_unit_id_idx").on(table.organizationUnitId),
  ]
);

export const teamMember = pgTable(
  "team_member",
  {
    teamId: uuid("team_id")
      .notNull()
      .references(() => team.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.teamId, table.userId] }),
    index("team_member_user_id_idx").on(table.userId),
  ]
);

export const project = pgTable(
  "project",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ownerUserId: text("owner_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    companyId: uuid("company_id").references(() => company.id, {
      onDelete: "set null",
    }),
    teamId: uuid("team_id")
      .notNull()
      .references(() => team.id, { onDelete: "restrict" }),
    type: projectType("type").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    notes: text("notes"),
    status: projectStatus("status").default("not-started").notNull(),
    startDate: date("start_date", { mode: "string" }).notNull(),
    endDate: date("end_date", { mode: "string" }).notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    deletedByUserId: text("deleted_by_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    ...timestamps,
  },
  (table) => [
    index("project_owner_user_id_idx").on(table.ownerUserId),
    index("project_team_id_idx").on(table.teamId),
    index("project_company_id_idx").on(table.companyId),
    index("project_status_idx").on(table.status),
    index("project_deleted_at_idx").on(table.deletedAt),
    check(
      "project_date_range_check",
      sql`${table.endDate} >= ${table.startDate}`
    ),
    check(
      "project_company_by_type_check",
      sql`(${table.type} = 'internal' and ${table.companyId} is not null) or (${table.type} = 'outsource' and ${table.companyId} is null)`
    ),
  ]
);

export const projectMember = pgTable(
  "project_member",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    isManager: boolean("is_manager").default(false).notNull(),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.projectId, table.userId] }),
    index("project_member_user_id_idx").on(table.userId),
  ]
);

export const projectPermissionGrant = pgTable(
  "project_permission_grant",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    action: projectPermissionAction("action").notNull(),
    grantedByUserId: text("granted_by_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.projectId, table.userId, table.action] }),
    index("project_permission_grant_user_id_idx").on(table.userId),
  ]
);

export const projectFavorite = pgTable(
  "project_favorite",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    projectId: uuid("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.projectId] }),
    index("project_favorite_project_id_idx").on(table.projectId),
  ]
);

export const projectStatusHistory = pgTable(
  "project_status_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    fromStatus: projectStatus("from_status"),
    toStatus: projectStatus("to_status").notNull(),
    changedByUserId: text("changed_by_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("project_status_history_project_id_idx").on(table.projectId),
  ]
);

export const companyRelations = relations(company, ({ many }) => ({
  organizationUnits: many(organizationUnit),
  projects: many(project),
}));

export const organizationUnitRelations = relations(
  organizationUnit,
  ({ many, one }) => ({
    company: one(company, {
      fields: [organizationUnit.companyId],
      references: [company.id],
    }),
    parent: one(organizationUnit, {
      fields: [organizationUnit.parentId],
      references: [organizationUnit.id],
      relationName: "organizationUnitHierarchy",
    }),
    children: many(organizationUnit, {
      relationName: "organizationUnitHierarchy",
    }),
    teams: many(team),
  })
);

export const teamRelations = relations(team, ({ many, one }) => ({
  organizationUnit: one(organizationUnit, {
    fields: [team.organizationUnitId],
    references: [organizationUnit.id],
  }),
  members: many(teamMember),
  projects: many(project),
}));

export const teamMemberRelations = relations(teamMember, ({ one }) => ({
  team: one(team, {
    fields: [teamMember.teamId],
    references: [team.id],
  }),
  user: one(user, {
    fields: [teamMember.userId],
    references: [user.id],
  }),
}));

export const projectRelations = relations(project, ({ many, one }) => ({
  owner: one(user, {
    fields: [project.ownerUserId],
    references: [user.id],
    relationName: "projectOwner",
  }),
  company: one(company, {
    fields: [project.companyId],
    references: [company.id],
  }),
  team: one(team, {
    fields: [project.teamId],
    references: [team.id],
  }),
  members: many(projectMember),
  permissionGrants: many(projectPermissionGrant),
  favorites: many(projectFavorite),
  statusHistory: many(projectStatusHistory),
}));

export const projectMemberRelations = relations(projectMember, ({ one }) => ({
  project: one(project, {
    fields: [projectMember.projectId],
    references: [project.id],
  }),
  user: one(user, {
    fields: [projectMember.userId],
    references: [user.id],
  }),
}));

export const projectFavoriteRelations = relations(
  projectFavorite,
  ({ one }) => ({
    project: one(project, {
      fields: [projectFavorite.projectId],
      references: [project.id],
    }),
    user: one(user, {
      fields: [projectFavorite.userId],
      references: [user.id],
    }),
  })
);
