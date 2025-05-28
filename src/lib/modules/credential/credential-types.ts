import { z } from 'zod';

export const CreateCredentialSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
});

export const ValidateCredentialSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
});

export type CreateCredentialDTO = z.infer<typeof CreateCredentialSchema>;
export type ValidateCredentialDTO = z.infer<typeof ValidateCredentialSchema>;
