import {
  Add01Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FilterMailIcon,
  LayoutThreeColumnIcon,
  ListViewIcon,
  ProfileIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";

import { Button } from "@inqra/ui/components/button";
import { ButtonGroup } from "@inqra/ui/components/button-group";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@inqra/ui/components/input-group";
import { Separator } from "@inqra/ui/components/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@inqra/ui/components/table";
import { Tabs, TabsList, TabsTrigger } from "@inqra/ui/components/tabs";

import {
  isTaskStatusFilter,
  isTaskWorkspaceView,
  TASK_STATUS_FILTERS,
} from "../task.constants";
import { mockTasks } from "../task.fixtures";
import type { Task, TaskStatus, TaskWorkspaceView } from "../task.types";
import { createTaskTableColumns } from "./task-table-columns";

const DEFAULT_PAGE_SIZE = 10;

function getAriaSortValue(
  sortingDirection: false | "asc" | "desc"
): "ascending" | "descending" | "none" {
  if (sortingDirection === "asc") {
    return "ascending";
  }

  if (sortingDirection === "desc") {
    return "descending";
  }

  return "none";
}

export function ProjectTasksTable({
  view,
  onViewChange,
}: {
  view: TaskWorkspaceView;
  onViewChange: (view: TaskWorkspaceView) => void;
}) {
  const [tasks, setTasks] = useState<Task[]>(() => [...mockTasks]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const handleTaskStatusChange = useCallback(
    (taskId: string, status: TaskStatus) => {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? { ...task, status } : task
        )
      );
    },
    []
  );

  const columns = useMemo(
    () => createTaskTableColumns(handleTaskStatusChange),
    [handleTaskStatusChange]
  );

  const table = useReactTable({
    data: tasks,
    columns,
    state: {
      columnFilters,
      globalFilter,
      pagination,
      sorting,
    },
    autoResetPageIndex: true,
    getRowId: (task) => task.id,
    globalFilterFn: "includesString",
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const statusFilterValue = columnFilters.find(
    (filter) => filter.id === "status"
  )?.value;
  const statusFilter =
    typeof statusFilterValue === "string" &&
    isTaskStatusFilter(statusFilterValue)
      ? statusFilterValue
      : "all";
  const filteredRowCount = table.getFilteredRowModel().rows.length;
  const visibleRows = table.getRowModel().rows;
  const { pageIndex, pageSize } = table.getState().pagination;
  const firstVisibleRow = filteredRowCount === 0 ? 0 : pageIndex * pageSize + 1;
  const lastVisibleRow = Math.min((pageIndex + 1) * pageSize, filteredRowCount);

  function handleStatusFilterChange(value: string | number) {
    if (typeof value !== "string" || !isTaskStatusFilter(value)) {
      return;
    }

    setColumnFilters(value === "all" ? [] : [{ id: "status", value }]);
  }

  function handleViewChange(value: string | number) {
    if (typeof value === "string" && isTaskWorkspaceView(value)) {
      onViewChange(value);
    }
  }

  return (
    <section className="grid auto-rows-auto items-start gap-4">
      <div className="grid grid-cols-2 items-start gap-4">
        <Tabs value={view} onValueChange={handleViewChange}>
          <TabsList>
            <TabsTrigger value="list">
              <HugeiconsIcon icon={ListViewIcon} data-icon="inline-start" />
              <span>List</span>
            </TabsTrigger>
            <TabsTrigger value="board">
              <HugeiconsIcon
                icon={LayoutThreeColumnIcon}
                data-icon="inline-start"
              />
              <span>Board</span>
            </TabsTrigger>
            <TabsTrigger value="details">
              <HugeiconsIcon icon={ProfileIcon} data-icon="inline-start" />
              <span>Details</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2.5 place-self-end-safe">
          <ButtonGroup>
            <InputGroup className="max-w-xs">
              <InputGroupInput
                value={globalFilter}
                placeholder="ค้นหา Task..."
                aria-label="ค้นหา Task"
                onChange={(event) => setGlobalFilter(event.target.value)}
              />
              <InputGroupAddon>
                <HugeiconsIcon icon={Search01Icon} />
              </InputGroupAddon>
            </InputGroup>
            <Button
              type="button"
              size="icon"
              variant="outline"
              aria-label="การค้นหาขั้นสูง"
            >
              <HugeiconsIcon icon={FilterMailIcon} />
            </Button>
          </ButtonGroup>

          <Separator
            orientation="vertical"
            className="data-vertical:h-8 data-vertical:self-center"
          />

          <Button type="button" variant="primaryGradient">
            <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
            <span>เพิ่ม Task</span>
          </Button>
        </div>
      </div>

      <Tabs value={statusFilter} onValueChange={handleStatusFilterChange}>
        <TabsList className="max-w-full justify-start overflow-x-auto">
          {TASK_STATUS_FILTERS.map((filter) => (
            <TabsTrigger key={filter.value} value={filter.value}>
              {filter.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="rounded-md border">
        <Table className="min-w-300">
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-muted h-14">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-primary font-semibold"
                    style={{ width: header.getSize() }}
                    aria-sort={
                      header.column.getCanSort()
                        ? getAriaSortValue(header.column.getIsSorted())
                        : undefined
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {visibleRows.length > 0 ? (
              visibleRows.map((row) => (
                <TableRow key={row.id} className="h-16">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  ไม่พบ Task ที่ตรงกับตัวกรอง
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-muted-foreground flex items-center justify-between text-sm">
        <span>
          แสดง {firstVisibleRow}-{lastVisibleRow} จาก {filteredRowCount} Task
        </span>
        <div className="flex items-center gap-2">
          <span>
            หน้า {table.getState().pagination.pageIndex + 1} จาก{" "}
            {Math.max(table.getPageCount(), 1)}
          </span>
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            disabled={!table.getCanPreviousPage()}
            aria-label="หน้าก่อนหน้า"
            onClick={() => table.previousPage()}
          >
            <HugeiconsIcon icon={ChevronLeftIcon} />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            disabled={!table.getCanNextPage()}
            aria-label="หน้าถัดไป"
            onClick={() => table.nextPage()}
          >
            <HugeiconsIcon icon={ChevronRightIcon} />
          </Button>
        </div>
      </div>
    </section>
  );
}
