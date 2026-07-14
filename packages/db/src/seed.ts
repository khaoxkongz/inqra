import dotenv from "dotenv";
import { asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { user } from "./schema/auth";
import {
  company,
  organizationUnit,
  project,
  projectFavorite,
  projectMember,
  team,
  teamMember,
} from "./schema/project";

dotenv.config({ path: "../../apps/server/.env" });

const databaseUrl = process.env.DATABASE_URL;
const seedUserId = process.env.SEED_USER_ID;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed the database");
}

const ids = {
  company: "10000000-0000-4000-8000-000000000001",
  division: "20000000-0000-4000-8000-000000000002",
  project: {
    csat: "40000000-0000-4000-8000-000000000004",
    dhi: "40000000-0000-4000-8000-000000000005",
    emergency: "40000000-0000-4000-8000-000000000001",
    health: "40000000-0000-4000-8000-000000000002",
    smartHospital: "40000000-0000-4000-8000-000000000003",
  },
  section: "20000000-0000-4000-8000-000000000003",
  team: "30000000-0000-4000-8000-000000000001",
  unit: "20000000-0000-4000-8000-000000000004",
  workstream: "20000000-0000-4000-8000-000000000001",
} as const;

const seedProjects = [
  {
    endDate: "2025-02-22",
    id: ids.project.emergency,
    isFavorite: true,
    name: "ทะเบียนการรับรององค์กรและหลักสูตรการศึกษาหรือฝึกอบรมผู้ปฏิบัติการการให้ประกาศนียบัตรและบัตรประจำตัวผู้ปฏิบัติการ สถาบันการแพทย์ฉุกเฉินแห่งชาติ",
    startDate: "2025-01-15",
    status: "in-progress" as const,
  },
  {
    endDate: "2025-02-22",
    id: ids.project.health,
    isFavorite: false,
    name: "Health Score Phase 2",
    startDate: "2025-01-15",
    status: "in-progress" as const,
  },
  {
    endDate: "2025-02-28",
    id: ids.project.smartHospital,
    isFavorite: false,
    name: "[Smart Hospital] - Intern Doctor",
    startDate: "2025-01-14",
    status: "completed" as const,
  },
  {
    endDate: "2025-12-27",
    id: ids.project.csat,
    isFavorite: true,
    name: "CSAT 2.0",
    startDate: "2025-01-20",
    status: "completed" as const,
  },
  {
    endDate: "2025-12-27",
    id: ids.project.dhi,
    isFavorite: false,
    name: "DHI - Back Office",
    startDate: "2025-01-20",
    status: "in-review" as const,
  },
] as const;

const seed = async (): Promise<void> => {
  const pool = new Pool({ connectionString: databaseUrl });
  const database = drizzle(pool);

  try {
    await database
      .insert(company)
      .values({ id: ids.company, name: "บริษัท อินเทอร์เน็ตประเทศไทย จำกัด (มหาชน)" })
      .onConflictDoNothing();

    await database
      .insert(organizationUnit)
      .values([
        {
          companyId: ids.company,
          id: ids.workstream,
          name: "Digital Healthcare",
          type: "business-line",
        },
        {
          companyId: ids.company,
          id: ids.division,
          name: "Platform Engineering",
          parentId: ids.workstream,
          type: "division",
        },
        {
          companyId: ids.company,
          id: ids.section,
          name: "Product Development",
          parentId: ids.division,
          type: "section",
        },
        {
          companyId: ids.company,
          id: ids.unit,
          name: "Business Dashboard - Data Wealth",
          parentId: ids.section,
          type: "unit",
        },
      ])
      .onConflictDoNothing();

    await database
      .insert(team)
      .values({
        id: ids.team,
        name: "Business Dashboard - Data Wealth",
        organizationUnitId: ids.unit,
      })
      .onConflictDoNothing();

    const [owner] = await database
      .select({ id: user.id })
      .from(user)
      .where(seedUserId ? eq(user.id, seedUserId) : undefined)
      .orderBy(asc(user.createdAt))
      .limit(1);

    if (!owner) {
      return;
    }

    await database
      .insert(teamMember)
      .values({ teamId: ids.team, userId: owner.id })
      .onConflictDoNothing();

    await database
      .insert(project)
      .values(
        seedProjects.map((seedProject) => ({
          companyId: ids.company,
          endDate: seedProject.endDate,
          id: seedProject.id,
          name: seedProject.name,
          ownerUserId: owner.id,
          startDate: seedProject.startDate,
          status: seedProject.status,
          teamId: ids.team,
          type: "internal" as const,
        }))
      )
      .onConflictDoNothing();

    await database
      .insert(projectMember)
      .values(
        seedProjects.map((seedProject) => ({
          isManager: true,
          projectId: seedProject.id,
          userId: owner.id,
        }))
      )
      .onConflictDoNothing();

    await database
      .insert(projectFavorite)
      .values(
        seedProjects
          .filter((seedProject) => seedProject.isFavorite)
          .map((seedProject) => ({
            projectId: seedProject.id,
            userId: owner.id,
          }))
      )
      .onConflictDoNothing();
  } finally {
    await pool.end();
  }
};

await seed();
