import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  ArrowUpDownIcon,
  Copy01Icon,
  EllipsisVerticalIcon,
  Flag03Icon,
  SubnodeAddIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Column } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import type { ReactNode } from "react";

import { Button } from "@inqra/ui/components/button";
import { cn } from "@inqra/ui/lib/utils";

import type { Task, TaskStatus } from "../task.types";
import { TaskMemberGroup } from "./task-member-group";
import { TaskStatusSelect } from "./task-status-select";

const dateFormatter = new Intl.DateTimeFormat("en-GB");
const taskColumnHelper = createColumnHelper<Task>();

function formatTaskDate(date: string): string {
  return dateFormatter.format(new Date(`${date}T00:00:00`));
}

function formatOptionalTaskDate(date: string | null): string {
  return date ? formatTaskDate(date) : "-";
}

function TaskColumnHeader<TValue>({
  column,
  children,
  className,
  sortLabel,
}: {
  column: Column<Task, TValue>;
  children: ReactNode;
  className?: string;
  sortLabel: string;
}) {
  const sortingDirection = column.getIsSorted();
  const sortingIcon =
    sortingDirection === "asc"
      ? ArrowUp01Icon
      : sortingDirection === "desc"
        ? ArrowDown01Icon
        : ArrowUpDownIcon;

  return (
    <Button
      type="button"
      variant="ghost"
      className={cn("-ml-2 h-auto font-semibold", className)}
      aria-label={`เรียงตาม ${sortLabel}`}
      onClick={column.getToggleSortingHandler()}
    >
      <span>{children}</span>
      <HugeiconsIcon icon={sortingIcon} data-icon="inline-end" />
    </Button>
  );
}

function TaskNameCell({ task }: { task: Task }) {
  return (
    <div className="flex min-w-80 items-center gap-1">
      <span className="max-w-52 truncate" title={task.name}>
        {task.name}
      </span>

      <Button
        size="icon-sm"
        type="button"
        variant="ghost"
        className="text-primary"
        aria-label="คัดลอกชื่อ Task"
      >
        <HugeiconsIcon icon={Copy01Icon} />
      </Button>

      {task.subtaskCount > 0 ? (
        <Button type="button" variant="ghost" className="text-primary">
          <HugeiconsIcon icon={SubnodeAddIcon} data-icon="inline-start" />
          <span>{task.subtaskCount}</span>
        </Button>
      ) : null}

      {task.isFlagged ? (
        <Button
          size="icon-sm"
          type="button"
          variant="destructive"
          className="rounded-full"
          aria-label="Task นี้ถูกปักธง"
        >
          <HugeiconsIcon icon={Flag03Icon} />
        </Button>
      ) : null}
    </div>
  );
}

export function createTaskTableColumns(
  onTaskStatusChange: (taskId: string, status: TaskStatus) => void
) {
  return [
    taskColumnHelper.accessor("name", {
      size: 373,
      header: ({ column }) => (
        <TaskColumnHeader column={column} sortLabel="Task">
          Task
        </TaskColumnHeader>
      ),
      cell: ({ row }) => <TaskNameCell task={row.original} />,
    }),
    taskColumnHelper.accessor((task) => task.startDate, {
      id: "timeline",
      size: 190,
      header: ({ column }) => (
        <TaskColumnHeader
          column={column}
          className="text-center"
          sortLabel="Timeline"
        >
          <span>
            Timeline
            <br />
            (เริ่มต้น - สิ้นสุด)
          </span>
        </TaskColumnHeader>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {formatTaskDate(row.original.startDate)} -{" "}
          {formatTaskDate(row.original.endDate)}
        </div>
      ),
    }),
    taskColumnHelper.accessor("submittedAt", {
      size: 140,
      header: ({ column }) => (
        <TaskColumnHeader column={column} sortLabel="วันที่ส่งงาน">
          วันที่ส่งงาน
        </TaskColumnHeader>
      ),
      cell: ({ getValue }) => formatOptionalTaskDate(getValue()),
    }),
    taskColumnHelper.accessor("approvedAt", {
      size: 140,
      header: ({ column }) => (
        <TaskColumnHeader column={column} sortLabel="วันที่อนุมัติ">
          วันที่อนุมัติ
        </TaskColumnHeader>
      ),
      cell: ({ getValue }) => formatOptionalTaskDate(getValue()),
    }),
    taskColumnHelper.accessor("owners", {
      size: 150,
      header: "ผู้รับผิดชอบ",
      enableSorting: false,
      enableGlobalFilter: false,
      cell: ({ row }) => <TaskMemberGroup members={row.original.owners} />,
    }),
    taskColumnHelper.accessor("operators", {
      size: 150,
      header: "ผู้ดำเนินการ",
      enableSorting: false,
      enableGlobalFilter: false,
      cell: ({ row }) => (
        <TaskMemberGroup
          members={row.original.operators}
          additionalMemberCount={row.original.additionalOperatorCount}
        />
      ),
    }),
    taskColumnHelper.accessor("status", {
      size: 180,
      header: ({ column }) => (
        <TaskColumnHeader column={column} sortLabel="สถานะ">
          สถานะ
        </TaskColumnHeader>
      ),
      filterFn: (row, columnId, filterValue: TaskStatus) =>
        row.getValue(columnId) === filterValue,
      cell: ({ row }) => (
        <TaskStatusSelect
          status={row.original.status}
          onStatusChange={(status) =>
            onTaskStatusChange(row.original.id, status)
          }
        />
      ),
    }),
    taskColumnHelper.display({
      id: "actions",
      size: 88,
      header: () => <span className="sr-only">การทำงาน</span>,
      enableSorting: false,
      enableGlobalFilter: false,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button
            size="icon-sm"
            type="button"
            variant="outline"
            aria-label={`การทำงานเพิ่มเติมสำหรับ ${row.original.name}`}
          >
            <HugeiconsIcon icon={EllipsisVerticalIcon} />
          </Button>
          <Button
            size="icon-sm"
            type="button"
            variant="ghost"
            aria-label={`เปิดรายละเอียด ${row.original.name}`}
          >
            <HugeiconsIcon icon={ArrowDown01Icon} />
          </Button>
        </div>
      ),
    }),
  ];
}
