ALTER TABLE "project" DROP CONSTRAINT "project_team_id_team_id_fk";
--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "team_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_date_range_check" CHECK ("project"."end_date" >= "project"."start_date");--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_company_by_type_check" CHECK (("project"."type" = 'internal' and "project"."company_id" is not null) or ("project"."type" = 'outsource' and "project"."company_id" is null));