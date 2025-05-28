import { z } from 'zod';

export const CreateSessionSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, { message: 'Senha deve ter no mínimo 8 caracteres' }),
});

export type CreateSessionDTO = z.infer<typeof CreateSessionSchema>;
