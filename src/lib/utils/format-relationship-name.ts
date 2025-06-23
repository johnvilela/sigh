import { USER_ROLE } from "@/generated/prisma";

export interface FormatRelationshipNameParam {
  federation?: { name?: string };
  team?: { name?: string };
  role: USER_ROLE
}

export function formatRelationshipName (item: FormatRelationshipNameParam) {
  if (item.federation) {
    return item.federation.name
  }

  if (item.team) {
    return item.team.name
  }

  if (item?.role === USER_ROLE.GOD) return '-';

  return 'CBHG'
}