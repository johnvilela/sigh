
import { USER_ROLE } from '@/generated/prisma';
import { z } from 'zod';

export interface IFindOneUsersParams {
  id: string;
  includeFederation?: boolean;
  includeTeam?: boolean;
}

export interface IFindAllUsersParams {
  role?: USER_ROLE[];
  includeFederation?: boolean;
  includeTeam?: boolean;
  filters?: {
    name?: string;
    federationId?: string;
    teamId?: string;
  };
}

export const MutateUserSchema = z.object({
  id: z.string().optional(),
  name: z
    .string({
      required_error: 'Nome é obrigatório',
    })
    .min(3)
    .max(255),
  email: z.string().email('Email inválido'),
  relatedId: z
    .string({
      required_error: 'Usuário não está relacionado a nada',
    })
    .uuid()
    .optional(),
  role: z.enum([USER_ROLE.ADMIN, USER_ROLE.ADMINFEDERATION, USER_ROLE.ADMINTEAM, USER_ROLE.GOD]),
  newPasswordId: z.string().optional(),
});

export type MutateUserDTO = z.infer<typeof MutateUserSchema> & {
  id?: string;
};
