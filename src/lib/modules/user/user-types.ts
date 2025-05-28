import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z
    .string({
      required_error: 'Nome é obrigatório',
    })
    .min(3)
    .max(255),
  email: z.string().email('Email inválido'),
  document: z
    .string({
      required_error: 'CPF é obrigatório',
    })
    .min(3)
    .max(32),
  birthDate: z
    .string({
      required_error: 'Data de nascimento é obrigatória',
    })
    .date(),
  teamId: z
    .string({
      required_error: 'Clube é obrigatório',
    })
    .uuid()
    .optional(),
  password: z
    .string({
      required_error: 'Senha é obrigatória',
    })
    .min(6)
    .max(255),
});

export type CreateUserDTO = Omit<z.infer<typeof CreateUserSchema>, 'password'> & {
  id?: string;
};
