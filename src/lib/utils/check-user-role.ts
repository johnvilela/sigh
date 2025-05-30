import { User, USER_ROLE } from "@/generated/prisma";

export function checkUserRole (arr: USER_ROLE[], user: User) {
  if (user.role === USER_ROLE.GOD) return true;

  return arr.includes(user.role as USER_ROLE);
}