import { User, USER_ROLE } from "@/generated/prisma";
import { getValue } from "./get-value";

export function validateUser (
  user: User,
) {
  return {
    role (arr: USER_ROLE[]) {
      if (user.role === USER_ROLE.GOD) return true;

      return arr.includes(user.role as USER_ROLE);
    },
    relation (relation: 'FEDERATION' | 'TEAM', data: Record<string | number | symbol, unknown>) {
      const federationId = getValue(user, 'federationId', null);
      const teamId = getValue(user, 'teamId', null);
      const relationId = getValue(data, 'id', null);

      if (
        (relation === 'FEDERATION' && federationId !== relationId) ||
        (relation === 'TEAM' && teamId !== relationId)
      ) {
        return false;
      }

      return true;
    },
    both (arr: USER_ROLE[], relation: 'FEDERATION' | 'TEAM', data: Record<string | number | symbol, unknown>) {
      if(this.role(arr)) {
        return this.relation(relation, data);
      }

      return false;
    }
  }
}