import { USER_ROLE } from '@/generated/prisma';
import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z
    .string({
      required_error: 'Nome é obrigatório',
    })
    .min(3)
    .max(255),
  email: z.string().email('Email inválido'),
  federationId: z
    .string({
      required_error: 'Federação é obrigatória',
    })
    .uuid()
    .optional(),
  teamId: z
    .string({
      required_error: 'Clube é obrigatório',
    })
    .uuid()
    .optional(),
  role: z
    .enum([USER_ROLE.ADMIN, USER_ROLE.ADMINFEDERATION, USER_ROLE.ADMINTEAM, USER_ROLE.GOD], {
      required_error: 'Função é obrigatória',
    })
    .default(USER_ROLE.ADMINTEAM),
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema> & {
  id?: string;
};
