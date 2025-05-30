import { z } from "zod";

export interface GetFederationByIdParams {
  id: string;
  includeTeams?: boolean;
  includeUsers?: boolean;
  includeAthletes?: boolean;
}

export interface GetAllFederationParameter {
  name?: string;
}

export const MutateFederationFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  initials: z.string().min(2, 'Sigla deve ter no mínimo 2 caracteres'),
  uf: z.string().length(2, 'UF obrigatório'),
  email: z.string().email('Email inválido'),
  presidentName: z.string().min(3, 'Nome do presidente deve ter no mínimo 3 caracteres'),
  beginningOfTerm: z.string(),
  endOfTerm: z.string(),
  electionMinutes: z.string().url('URL da ata de eleição inválida').optional(),
  presidentDocument: z.string().url('URL do documento do presidente inválido').optional(),
  federationDocument: z.string().url('URL do documento da federação inválido').optional(),
  logo: z.string().url('URL do logo inválido').optional(),
});

export type MutateFederationFormDTO = z.infer<typeof MutateFederationFormSchema>;