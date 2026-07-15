import {
  Add01Icon,
  Calendar02Icon,
  Cancel01Icon,
  ChevronsUpDown,
  Delete02Icon,
  DocumentValidationIcon,
  Download01Icon,
  Edit02Icon,
  FilterIcon,
  GridViewIcon,
  Home05Icon,
  ListViewIcon,
  Notification01Icon,
  Search01Icon,
  StarIcon,
  Upload01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import {
  createLazyFileRoute,
  getRouteApi,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import * as React from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@inqra/ui/components/avatar";
import { Badge } from "@inqra/ui/components/badge";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbPage,
} from "@inqra/ui/components/breadcrumb";
import { Button } from "@inqra/ui/components/button";
import { ButtonGroup } from "@inqra/ui/components/button-group";
import { Checkbox } from "@inqra/ui/components/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@inqra/ui/components/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@inqra/ui/components/field";
import { Input } from "@inqra/ui/components/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@inqra/ui/components/input-group";
import { Label } from "@inqra/ui/components/label";
import { ScrollArea } from "@inqra/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@inqra/ui/components/select";
import { Separator } from "@inqra/ui/components/separator";
import { Switch } from "@inqra/ui/components/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@inqra/ui/components/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@inqra/ui/components/tooltip";

import { ProjectStatusBadge } from "@/modules/projects/components/project-status-badge";
import type { Project } from "@/modules/projects/project.types";
import {
  formatNumber,
  formatProjectDate,
  PROJECT_NAME_MAX_LENGTH,
  truncateText,
} from "@/modules/projects/project.utils";

const route = getRouteApi("/app/");

type SortingMethod = {
  id: string;
  name: string;
};

const sortingMethods: SortingMethod[] = [
  { id: "createdDesc", name: "สร้างล่าสุด" },
  { id: "createdAsc", name: "สร้างเก่าสุด" },
  { id: "enAsc", name: "ชื่อ A - ฮ" },
  { id: "enDesc", name: "ชื่อ Z - ก" },
  { id: "thAsc", name: "ชื่อ ก - Z" },
  { id: "thDesc", name: "ชื่อ ฮ - A" },
];

type ProjectStatus = SortingMethod;

const projectStatuses: ProjectStatus[] = [
  { id: "", name: "ยังไม่เริ่ม" },
  { id: "", name: "กำลังดำเนินการ" },
  { id: "", name: "รอตรวจสอบ" },
  { id: "", name: "เสร็จสิ้น / ปิดโปเจกต์" },
  { id: "", name: "ยกเลิก" },
];

type PermissionStatus = ProjectStatus;

const permissionStatuses: PermissionStatus[] = [
  { id: "", name: "จัดการทั้งหมด" },
  { id: "", name: "เพิ่ม Task/Sub Task" },
  { id: "", name: "จัดการทั่วไป" },
];

type TaskStatus = ProjectStatus;

const tasksStatuses: TaskStatus[] = [
  { id: "", name: "งานที่ยังไม่เริ่ม" },
  { id: "", name: "กำลังดำเนินการ" },
  { id: "", name: "อยู่ระหว่างการตรวจสอบ" },
  { id: "", name: "ปฏิเสธ / ต้องแก้ไข" },
  { id: "", name: "เสร็จสิ้น" },
  { id: "", name: "ยกเลิก" },
];

type TaskResponsibilityStatus = ProjectStatus;

const taskResponsibilityStatuses: TaskResponsibilityStatus[] = [
  { id: "", name: "ผู้รับผิดชอบ" },
  { id: "", name: "ผู้ดำเนินการ" },
  { id: "", name: "ผู้ตรวจสอบ" },
];

function ProjectTeamBadge({ teamName }: Pick<Project, "teamName">) {
  return (
    <Badge variant="team">
      <span className="bg-linear-to-b from-[hsla(144_77%_32%/1)] to-[hsla(135_47%_58%/1)] bg-clip-text text-transparent">
        ทีม {teamName}
      </span>
    </Badge>
  );
}

function ProjectTitle({ name }: Pick<Project, "name">) {
  return (
    <Tooltip>
      <TooltipTrigger className="inline-flex h-10 w-full items-center text-start">
        {truncateText(name, PROJECT_NAME_MAX_LENGTH)}
      </TooltipTrigger>
      <TooltipContent>{name}</TooltipContent>
    </Tooltip>
  );
}

function ProjectActions({
  favoriteLimit,
  id,
  isFavorite,
}: Pick<Project, "id" | "isFavorite"> & { favoriteLimit: number }) {
  const [open, setOpen] = React.useState(false);
  const { queryClient, trpc } = Route.useRouteContext();
  const favoriteMutation = useMutation(
    trpc.project.favorite.set.mutationOptions({
      onError: (error) => {
        if (error.data?.code === "CONFLICT") {
          setOpen(true);
        }
      },
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(trpc.project.list.queryFilter()),
          queryClient.invalidateQueries(
            trpc.project.byId.queryFilter({ projectId: id })
          ),
        ]);
      },
    })
  );

  const handleFavoriteClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault();
    event.stopPropagation();
    favoriteMutation.mutate({ projectId: id, isFavorite: !isFavorite });
  };

  return (
    <React.Fragment>
      <div className="relative z-20 flex items-center gap-px">
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "นำออกจากรายการโปรด" : "เพิ่มในรายการโปรด"}
          disabled={favoriteMutation.isPending}
          onClick={handleFavoriteClick}
        >
          <HugeiconsIcon
            icon={StarIcon}
            className={isFavorite ? "text-amber-500" : undefined}
          />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className="text-primary"
          aria-label="แก้ไขโปรเจกต์"
        >
          <HugeiconsIcon icon={Edit02Icon} />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className="text-destructive"
          aria-label="ลบโปรเจกต์"
        >
          <HugeiconsIcon icon={Delete02Icon} />
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-88 sm:max-w-md">
          <figure className="flex flex-col items-center justify-center gap-4">
            <picture>
              <img
                src="/warning-state.png"
                alt="Warning favorite project limit."
                className="size-25"
              />
            </picture>

            <figcaption className="text-muted-foreground grid gap-2 truncate text-center text-sm">
              <div className="text-destructive text-xl">
                คุณเพิ่มโปรเจกต์ที่ชื่นชอบครบ {favoriteLimit} รายการแล้ว
              </div>
              <div>โปรดนำรายการเดิมออกก่อน เพื่อเพิ่มโปรเจกต์ใหม่</div>
            </figcaption>
          </figure>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

function ProjectMembers({
  members,
  additionalMemberCount,
}: Pick<Project, "members" | "additionalMemberCount">) {
  return (
    <AvatarGroup className="grayscale">
      {members.map((member) => (
        <Avatar key={member.id}>
          <AvatarImage src={member.avatarUrl} alt={member.displayName} />
          <AvatarFallback>{member.initials}</AvatarFallback>
        </Avatar>
      ))}
      {additionalMemberCount > 0 ? (
        <AvatarGroupCount>+{additionalMemberCount}</AvatarGroupCount>
      ) : null}
    </AvatarGroup>
  );
}

function ProjectGridCard({
  favoriteLimit,
  project,
}: {
  favoriteLimit: number;
  project: Project;
}) {
  return (
    <article className="relative isolate grid max-h-67 w-full min-w-0 auto-rows-max items-start gap-4 rounded-md border p-4 text-start">
      <div className="flex w-full items-center justify-between gap-px">
        <ProjectStatusBadge status={project.status} />
        <ProjectActions
          favoriteLimit={favoriteLimit}
          id={project.id}
          isFavorite={project.isFavorite}
        />
      </div>

      <ProjectTeamBadge teamName={project.teamName} />
      <ProjectTitle name={project.name} />

      <div className="text-muted-foreground flex w-full flex-col items-start justify-between gap-1 text-sm">
        <div className="flex items-center gap-1">
          <span>วันที่เริ่มโปรเจกต์</span>
          <span>:</span>
          <span className="text-foreground font-medium">
            {formatProjectDate(project.startDate)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span>วันที่สิ้นสุดโปรเจกต์</span>
          <span>:</span>
          <span className="text-foreground font-medium">
            {formatProjectDate(project.endDate)}
          </span>
        </div>
      </div>

      <div className="text-muted-foreground flex w-full items-center justify-between gap-4 text-sm">
        <ProjectMembers
          members={project.members}
          additionalMemberCount={project.additionalMemberCount}
        />
        <div className="flex items-center gap-1">
          <Button size="icon-sm" type="button" className="rounded-full">
            <HugeiconsIcon icon={DocumentValidationIcon} />
          </Button>
          <span className="text-foreground font-medium">
            {formatNumber(project.taskCount)}
          </span>
        </div>
      </div>

      <Link
        to="/app/project/$id"
        params={{ id: project.id }}
        className="absolute inset-0 cursor-pointer"
      />
    </article>
  );
}

function ProjectListCard({
  favoriteLimit,
  project,
}: {
  favoriteLimit: number;
  project: Project;
}) {
  return (
    <article className="relative isolate grid auto-rows-auto gap-4 rounded-md border p-4">
      <div className="flex items-center justify-between gap-4">
        <ProjectTeamBadge teamName={project.teamName} />
        <div className="flex items-center gap-px">
          <ProjectStatusBadge status={project.status} />
          <ProjectActions
            favoriteLimit={favoriteLimit}
            id={project.id}
            isFavorite={project.isFavorite}
          />
        </div>
      </div>

      <ProjectTitle name={project.name} />

      <div className="text-muted-foreground flex items-center justify-between gap-1 text-sm">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="วันที่ของโปรเจกต์"
          >
            <HugeiconsIcon icon={Calendar02Icon} />
          </Button>
          <div className="flex items-center gap-1">
            <span>วันที่สร้าง</span>
            <span>:</span>
            <span className="text-foreground font-medium">
              {formatProjectDate(project.startDate)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span>วันที่เสร็จ</span>
            <span>:</span>
            <span className="text-foreground font-medium">
              {formatProjectDate(project.endDate)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span>Total Task</span>
            <span>:</span>
            <span className="text-foreground font-medium">
              {formatNumber(project.taskCount)}
            </span>
          </div>
        </div>

        <ProjectMembers
          members={project.members}
          additionalMemberCount={project.additionalMemberCount}
        />
      </div>

      <Link
        to="/app/project/$id"
        params={{ id: project.id }}
        className="absolute inset-0 cursor-pointer"
      />
    </article>
  );
}

function RouteComponent() {
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate({ from: "/app/" });
  const { view, isFavorite } = route.useSearch();
  const { trpc } = route.useRouteContext();
  const { sort } = route.useSearch();
  const { data: projectList } = useSuspenseQuery(
    trpc.project.list.queryOptions({ favoriteOnly: isFavorite, sort })
  );
  const visibleProjects = projectList.items;

  return (
    <React.Fragment>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbPage className="[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
              <HugeiconsIcon icon={Home05Icon} className="size-5" />
            </BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        <Button size="icon-lg" variant="ghost" className="ml-auto">
          <HugeiconsIcon icon={Notification01Icon} className="size-5" />
        </Button>
      </header>

      <Tabs
        value={view}
        orientation="horizontal"
        defaultValue={view}
        className="flex flex-1 flex-col gap-4 p-4"
      >
        <div className="flex items-center justify-between gap-4">
          <ButtonGroup>
            <ButtonGroup>
              <InputGroup className="max-w-xs">
                <InputGroupInput placeholder="ค้นหาโปรเจกต์..." />
                <InputGroupAddon>
                  <HugeiconsIcon icon={Search01Icon} />
                </InputGroupAddon>
              </InputGroup>
            </ButtonGroup>
            <ButtonGroup>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(true)}
              >
                <HugeiconsIcon icon={FilterIcon} />
                <span>การค้นหาขั้นสูง</span>
              </Button>
            </ButtonGroup>
          </ButtonGroup>

          {visibleProjects.length > 0 ? (
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline">
                <HugeiconsIcon icon={Upload01Icon} />
                <span>Export Data</span>
              </Button>
              <Button type="button" variant="outline">
                <HugeiconsIcon icon={Download01Icon} />
                <span>Import Task</span>
              </Button>
              <Button variant="primaryGradient">
                <HugeiconsIcon icon={Add01Icon} />
                <span>สร้างโปรเจกต์</span>
              </Button>
            </div>
          ) : null}
        </div>

        {visibleProjects.length <= 0 ? (
          <div className="flex min-h-screen w-full min-w-0 flex-col items-center justify-center gap-4">
            <picture>
              <img
                src="/project-empty-state.png"
                alt="Project empty state"
                className="h-41.25 w-87.5"
              />
            </picture>

            <div className="flex flex-col items-center gap-2">
              <div className="text-center">
                <div>ยังไม่มีโปรเจกต์ของคุณ</div>
                <div>กรุณากดสร้างโปรเจกต์ หรือ Import Task โดยกดปุ่มด้านล่างนี้</div>
              </div>

              <div className="flex items-center gap-4">
                <Button type="button" variant="outline">
                  <HugeiconsIcon icon={Download01Icon} />
                  <span>Import Task</span>
                </Button>
                <Button variant="primaryGradient">
                  <HugeiconsIcon icon={Add01Icon} />
                  <span>สร้างโปรเจกต์</span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <React.Fragment>
            <div className="text-muted-foreground flex items-center justify-between gap-4 text-sm">
              <div className="text-foreground flex items-center gap-2">
                <div className="text-base font-medium">
                  ทั้งหมด {formatNumber(projectList.totalProjects)} โปรเจกต์
                </div>
                <Separator
                  orientation="vertical"
                  className="data-vertical:h-4 data-vertical:self-center"
                />
                <div>{formatNumber(projectList.totalTasks)} Task</div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Switch
                    id="favorite-mode"
                    checked={isFavorite}
                    onCheckedChange={() =>
                      navigate({
                        to: "/app",
                        search: (previousSearch) => ({
                          ...previousSearch,
                          isFavorite: !isFavorite,
                        }),
                      })
                    }
                  />
                  <Label htmlFor="favorite-mode">แสดงรายการโปรด</Label>
                </div>

                <Select
                  defaultValue={sortingMethods[0]}
                  itemToStringValue={(item) => item.id}
                >
                  <SelectTrigger className="border-none pr-0 pl-0 shadow-none [&_svg:last-child]:hidden">
                    <SelectValue>
                      {(sortingMethod: SortingMethod) => (
                        <span className="flex items-center gap-px">
                          <HugeiconsIcon icon={ChevronsUpDown} />
                          <span>เรียงตาม :</span>
                          <span className="text-sm">{sortingMethod.name}</span>
                        </span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="p-1 **:has-data-selected:text-red-500!">
                    {sortingMethods.map((sortingMethod) => (
                      <SelectItem
                        key={sortingMethod.id}
                        value={sortingMethod}
                        className="has-data-selected:text-red-500!"
                      >
                        {sortingMethod.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <TabsList>
                  <TabsTrigger
                    value="grid"
                    nativeButton={false}
                    render={
                      <Link
                        to="/app"
                        search={(prev) => ({ ...prev, view: "grid" })}
                      />
                    }
                  >
                    <HugeiconsIcon
                      icon={GridViewIcon}
                      aria-label="แสดงแบบกริด"
                    />
                  </TabsTrigger>
                  <TabsTrigger
                    value="list"
                    nativeButton={false}
                    render={
                      <Link
                        to="/app"
                        search={(prev) => ({ ...prev, view: "list" })}
                      />
                    }
                  >
                    <HugeiconsIcon icon={ListViewIcon} />
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent
              value="grid"
              className="grid auto-rows-max grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
            >
              {visibleProjects.map((project) => (
                <ProjectGridCard
                  favoriteLimit={projectList.favoriteLimit}
                  key={project.id}
                  project={project}
                />
              ))}
            </TabsContent>
            <TabsContent
              value="list"
              className="grid auto-rows-min grid-cols-1 gap-4"
            >
              {visibleProjects.map((project) => (
                <ProjectListCard
                  favoriteLimit={projectList.favoriteLimit}
                  key={project.id}
                  project={project}
                />
              ))}
            </TabsContent>
          </React.Fragment>
        )}
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="bg-[#FFFFFF] p-4 shadow-[0px_4px_30px_0px_#3CB52C12] ring-0 sm:max-w-2xl"
        >
          <DialogHeader className="group/card-header @container/card-header grid h-16 auto-rows-min flex-row items-center gap-1 rounded-t-xl has-data-[slot=card-action]:grid-cols-[1fr_auto]">
            <div className="flex flex-row items-center gap-4">
              <Button
                type="button"
                variant="secondary"
                className="size-12 rounded-full bg-linear-to-b from-[#DEFFE0] to-[#EAFFEB] shadow-[inset_0px_-4px_5.7px_0px_#0D8A7240] ring-8 ring-[#F2FEFBBD] backdrop-blur-3xl"
              >
                <HugeiconsIcon
                  icon={Search01Icon}
                  className="size-8 text-[#0D8A72]"
                />
              </Button>

              <DialogTitle className="truncate text-xl">
                การค้นหาขั้นสูง
              </DialogTitle>
            </div>

            <Button
              type="button"
              variant="ghost"
              data-slot="card-action"
              onClick={() => setOpen(false)}
              className="col-start-2 row-span-2 row-start-1 size-12 self-center-safe justify-self-end rounded-full"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="size-6" />
            </Button>
          </DialogHeader>

          <FieldSet>
            <FieldLegend>โปรเจกต์</FieldLegend>
            <FieldSeparator />
            <ScrollArea className="h-75">
              <FieldGroup className="gap-4">
                <Field
                  orientation="responsive"
                  className="gap-4 @md/field-group:*:w-full @md/field-group:*:data-[slot=field-label]:w-44 @md/field-group:*:data-[slot=field-label]:flex-auto"
                >
                  <FieldLabel htmlFor="name">ชื่อโปรเจกต์</FieldLabel>
                  <Input id="name" placeholder="Manpower" />
                </Field>

                <Field
                  orientation="responsive"
                  className="gap-4 @md/field-group:*:w-full @md/field-group:*:data-[slot=field-label]:w-44 @md/field-group:*:data-[slot=field-label]:flex-auto"
                >
                  <FieldLabel htmlFor="name">สถานะโปรเจกต์</FieldLabel>
                  <Input id="name" placeholder="ทั้งหมด" />
                </Field>

                <Field
                  orientation="responsive"
                  className="gap-4 @md/field-group:*:w-full @md/field-group:*:data-[slot=field-label]:w-44 @md/field-group:*:data-[slot=field-label]:flex-auto"
                >
                  <FieldLabel htmlFor="name">บริษัท</FieldLabel>
                  <Input
                    id="name"
                    placeholder="บริษัท อินเทอร์เน็ตประเทศไทย จำกัด (มหาชน)"
                  />
                </Field>

                <Field
                  orientation="responsive"
                  className="gap-4 @md/field-group:*:w-full @md/field-group:*:data-[slot=field-label]:w-44 @md/field-group:*:data-[slot=field-label]:flex-auto"
                >
                  <FieldLabel htmlFor="name">ทีม</FieldLabel>
                  <Input id="name" placeholder="Software Engineer" />
                </Field>

                <Field
                  orientation="responsive"
                  className="gap-4 @md/field-group:*:w-full @md/field-group:*:data-[slot=field-label]:w-44 @md/field-group:*:data-[slot=field-label]:flex-auto"
                >
                  <FieldLabel htmlFor="name" className="w-full">
                    ชื่อสมาชิกในโปรเจกต์
                  </FieldLabel>

                  <Field>
                    <Input id="name" placeholder="ณัฐพล จินากร" />
                    <FieldContent className="flex-row">
                      <Checkbox id="terms-checkbox-2" name="terms-checkbox-2" />
                      <FieldLabel htmlFor="terms-checkbox-2">
                        เลือกค้นหาจากตำแหน่งผู้ดูแลโปรเจกต์
                      </FieldLabel>
                    </FieldContent>
                  </Field>
                </Field>

                <Field
                  orientation="responsive"
                  className="gap-4 @md/field-group:*:w-full @md/field-group:*:data-[slot=field-label]:w-44 @md/field-group:*:data-[slot=field-label]:flex-auto"
                >
                  <FieldLabel htmlFor="name">สิทธิ์ Permission</FieldLabel>

                  <Field>
                    <Input id="name" placeholder="ทั้งหมด" />
                    <FieldDescription>
                      กรอกชื่อสมาชิกในโปรเจกต์ ก่อนทำการเลือก
                    </FieldDescription>
                  </Field>
                </Field>

                <Field
                  orientation="responsive"
                  className="gap-4 @md/field-group:*:w-full @md/field-group:*:data-[slot=field-label]:w-44 @md/field-group:*:data-[slot=field-label]:flex-auto"
                >
                  <FieldLabel htmlFor="name">วันที่สร้างโปรเจกต์</FieldLabel>
                  <Input id="name" placeholder="01/06/2025" />
                </Field>

                <Field
                  orientation="responsive"
                  className="gap-4 @md/field-group:*:w-full @md/field-group:*:data-[slot=field-label]:w-44 @md/field-group:*:data-[slot=field-label]:flex-auto"
                >
                  <FieldLabel htmlFor="name">วันที่เริ่มโปรเจกต์</FieldLabel>
                  <Input id="name" placeholder="01/06/2025" />
                </Field>

                <Field
                  orientation="responsive"
                  className="gap-4 @md/field-group:*:w-full @md/field-group:*:data-[slot=field-label]:w-44 @md/field-group:*:data-[slot=field-label]:flex-auto"
                >
                  <FieldLabel htmlFor="name">วันที่สิ้นสุดโปรเจกต์</FieldLabel>
                  <Input id="name" placeholder="30/07/2025" />
                </Field>
              </FieldGroup>
            </ScrollArea>
          </FieldSet>

          <FieldSet>
            <FieldLegend>Task</FieldLegend>
            <FieldSeparator />
            <ScrollArea className="h-75">
              <FieldGroup className="gap-4">
                <Field
                  orientation="responsive"
                  className="gap-4 @md/field-group:*:w-full @md/field-group:*:data-[slot=field-label]:w-44 @md/field-group:*:data-[slot=field-label]:flex-auto"
                >
                  <FieldLabel htmlFor="name">ชื่อ Task</FieldLabel>
                  <Input id="name" placeholder="Dashboard UXUI" />
                </Field>

                <Field
                  orientation="responsive"
                  className="gap-4 @md/field-group:*:w-full @md/field-group:*:data-[slot=field-label]:w-44 @md/field-group:*:data-[slot=field-label]:flex-auto"
                >
                  <FieldLabel htmlFor="name">Task ID</FieldLabel>
                  <Input id="name" placeholder="ค้นหา Task ID" />
                </Field>

                <Field
                  orientation="responsive"
                  className="gap-4 @md/field-group:*:w-full @md/field-group:*:data-[slot=field-label]:w-44 @md/field-group:*:data-[slot=field-label]:flex-auto"
                >
                  <FieldLabel htmlFor="name">Task Level</FieldLabel>
                  <Input id="name" placeholder="ทั้งหมด" />
                </Field>

                <Field
                  orientation="responsive"
                  className="gap-4 @md/field-group:*:w-full @md/field-group:*:data-[slot=field-label]:w-44 @md/field-group:*:data-[slot=field-label]:flex-auto"
                >
                  <FieldLabel htmlFor="name">Task Category</FieldLabel>

                  <Field>
                    <Input id="name" placeholder="ทั้งหมด" />
                    <FieldContent className="flex-row">
                      <Checkbox id="terms-checkbox-2" name="terms-checkbox-2" />
                      <FieldLabel htmlFor="terms-checkbox-2">
                        โปรดเลือกทีมก่อนเลือก Task Category
                      </FieldLabel>
                    </FieldContent>
                  </Field>
                </Field>

                <Field
                  orientation="responsive"
                  className="gap-4 @md/field-group:*:w-full @md/field-group:*:data-[slot=field-label]:w-44 @md/field-group:*:data-[slot=field-label]:flex-auto"
                >
                  <FieldLabel htmlFor="name">สถานะ Task</FieldLabel>
                  <Input id="name" placeholder="ทั้งหมด" />
                </Field>

                <Field
                  orientation="responsive"
                  className="gap-4 @md/field-group:*:w-full @md/field-group:*:data-[slot=field-label]:w-44 @md/field-group:*:data-[slot=field-label]:flex-auto"
                >
                  <FieldLabel htmlFor="name">ชื่อพนักงาน</FieldLabel>
                  <Input id="name" placeholder="ค้นหาชื่อ - นามสกุล หรือรหัสพนักงาน" />
                </Field>

                <Field
                  orientation="responsive"
                  className="gap-4 @md/field-group:*:w-full @md/field-group:*:data-[slot=field-label]:w-44 @md/field-group:*:data-[slot=field-label]:flex-auto"
                >
                  <FieldLabel htmlFor="name">บทบาทความรับผิดชอบ</FieldLabel>

                  <Field>
                    <Input id="name" placeholder="ทั้งหมด" />
                    <FieldContent className="flex-row">
                      <Checkbox id="terms-checkbox-2" name="terms-checkbox-2" />
                      <FieldLabel htmlFor="terms-checkbox-2">
                        กรอกชื่อพนักงานก่อน ถึงเลือกข้อมูลได้
                      </FieldLabel>
                    </FieldContent>
                  </Field>
                </Field>

                <Field
                  orientation="responsive"
                  className="gap-4 @md/field-group:*:w-full @md/field-group:*:data-[slot=field-label]:w-44 @md/field-group:*:data-[slot=field-label]:flex-auto"
                >
                  <FieldLabel htmlFor="name" className="w-full">
                    วันที่สร้าง Task
                  </FieldLabel>
                  <Input id="name" placeholder="01/06/2025 - 30/07/2025" />
                </Field>

                <Field
                  orientation="responsive"
                  className="gap-4 @md/field-group:*:w-full @md/field-group:*:data-[slot=field-label]:w-44 @md/field-group:*:data-[slot=field-label]:flex-auto"
                >
                  <FieldLabel htmlFor="name">วันที่กำหนดเริ่มงาน</FieldLabel>
                  <Input id="name" placeholder="01/06/2025 - 30/07/2025" />
                </Field>

                <Field
                  orientation="responsive"
                  className="gap-4 @md/field-group:*:w-full @md/field-group:*:data-[slot=field-label]:w-44 @md/field-group:*:data-[slot=field-label]:flex-auto"
                >
                  <FieldLabel htmlFor="name">วันที่กำหนดส่งงาน</FieldLabel>
                  <Input id="name" placeholder="01/06/2025 - 30/07/2025" />
                </Field>
              </FieldGroup>
            </ScrollArea>
          </FieldSet>

          <Field
            orientation="responsive"
            className="gap-4 @md/field-group:*:w-full @md/field-group:*:data-[slot=field-label]:w-44 @md/field-group:*:data-[slot=field-label]:flex-auto"
          >
            <Button type="submit" variant="outline" className="w-fit">
              ล้างค่า
            </Button>
            <Button type="button" variant="primaryGradient" className="w-fit">
              ค้นหา
            </Button>
          </Field>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export const Route = createLazyFileRoute("/app")({
  component: RouteComponent,
});
