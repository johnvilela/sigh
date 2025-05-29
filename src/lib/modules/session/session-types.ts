import { z } from 'zod';

export const CreateSessionSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
});

export type CreateSessionDTO = z.infer<typeof CreateSessionSchema>;
