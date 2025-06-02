import { z } from "zod";

export interface GetPartnerProjectByIdParams {
  id: string;
  includeFederation?: boolean;
  includeTeam?: boolean;
}

export interface GetAllPartnerProjectParams {
  includeTeam?: boolean;
  includeFederation?: boolean;
  filters?: { name?: string; teamId?: string; federationId?: string };
}

export const MutatePartnerProjectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string({
    required_error: "Descrição é obrigatória",
  }).max(2500, "Descrição não pode exceder 2500 caracteres"),
  initialDate: z.string({
    required_error: "Data inicial é obrigatória",
  }),
  finalDate: z.string({
    required_error: "Data final é obrigatória",
  }),
  malePractitioners: z.string({
    required_error: "Número de praticantes masculinos é obrigatório",
  }),
  femalePractitioners: z.string({
    required_error: "Número de praticantes femininos é obrigatório",
  }),
  ageGroupStart: z.string({
    required_error: "Idade mínima é obrigatória",
  }),
  ageGroupEnd: z.string({
    required_error: "Idade máxima é obrigatória",
  }),
  contactName: z.string({
    required_error: "Nome do contato é obrigatório",
  }),
  contactPhone: z.string({
    required_error: "Telefone de contato é obrigatório",
  }),
  federationId: z.string().optional(),
  teamId: z.string().optional(),
  address: z.object({
    city: z.string({
      required_error: "Cidade é obrigatória",
    }),
    uf: z.string({
      required_error: "UF é obrigatório",
    }),
    complement: z.string({
      required_error: "Complemento é obrigatório",
    }),
  })
})

export type MutatePartnerProjectDTO = z.infer<typeof MutatePartnerProjectSchema>;