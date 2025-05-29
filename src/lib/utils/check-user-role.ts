import { User, USER_ROLE } from "@/generated/prisma";

export function checkUserRole (arr: USER_ROLE[], user: User) {
  return arr.includes(user.role as USER_ROLE);
}