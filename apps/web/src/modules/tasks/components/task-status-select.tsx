import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@inqra/ui/components/combobox";

import {
  getTaskStatusFromLabel,
  getTaskStatusLabel,
  TASK_STATUS_LABELS,
} from "../task.constants";
import type { TaskStatus } from "../task.types";

export function TaskStatusSelect({
  status,
  onStatusChange,
}: {
  status: TaskStatus;
  onStatusChange: (status: TaskStatus) => void;
}) {
  const selectedLabel = getTaskStatusLabel(status);

  return (
    <Combobox
      value={selectedLabel}
      items={TASK_STATUS_LABELS}
      onValueChange={(label) => {
        const nextStatus = label ? getTaskStatusFromLabel(label) : undefined;

        if (nextStatus) {
          onStatusChange(nextStatus);
        }
      }}
    >
      <ComboboxInput aria-label="เปลี่ยนสถานะ Task" />
      <ComboboxContent>
        <ComboboxEmpty>ไม่พบสถานะ</ComboboxEmpty>
        <ComboboxList>
          {(label) => (
            <ComboboxItem key={label} value={label}>
              {label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
