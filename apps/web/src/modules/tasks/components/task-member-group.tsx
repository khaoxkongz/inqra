import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@inqra/ui/components/avatar";

import type { TaskMember } from "../task.types";

export function TaskMemberGroup({
  members,
  additionalMemberCount = 0,
}: {
  members: readonly TaskMember[];
  additionalMemberCount?: number;
}) {
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
