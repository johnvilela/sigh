import { USER_ROLE } from "@/generated/prisma";

export const userRoleDictionary: Record<USER_ROLE, string> = {
  [USER_ROLE.ADMINTEAM]: 'Administrador de Equipe',
  [USER_ROLE.ADMINFEDERATION]: 'Administrador de Federação',
  [USER_ROLE.GOD]: 'Administrador Geral',
  [USER_ROLE.ADMIN]: 'Administrador CBHG',
  [USER_ROLE.ATHLETE]: 'Atleta',
}