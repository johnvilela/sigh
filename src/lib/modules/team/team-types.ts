import { z } from "zod";

export interface GetTeamByIdParams {
  id: string;
  includeAthletes?: boolean;
  includeFederation?: boolean;
}

export interface GetAllTeamsParams {
  includeUsers?: boolean;
  includeFederation?: boolean;
  filter?: {
    name?: string;
    federationId?: string;
  };
}

export interface GetAllSmallTeamsParams {
  filter?: {
    federationId?: string;
  };
}

export const MutateTeamFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  initials: z.string().min(2, 'Sigla deve ter no mínimo 2 caracteres'),
  url: z.string({
    required_error: 'Site obrigatório'
  }),
  coachName: z.string().min(3, 'Nome do técnico deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  federationId: z.string().uuid('ID da federação inválido'),
  email: z.string().email('Email inválido'),
  presidentName: z.string().min(3, 'Nome do presidente deve ter no mínimo 3 caracteres'),
  beginningOfTerm: z.string(),
  endOfTerm: z.string(),
  electionMinutes: z.string().url('URL da ata de eleição inválida').optional(),
  presidentDocument: z.string().url('URL do documento do presidente inválido').optional(),
  teamDocument: z.string().url('URL do estatuto da entidade inválido').optional(),
  logo: z.string().url('URL do logo inválido').optional(),
});

export type MutateTeamFormDTO = z.infer<typeof MutateTeamFormSchema>;