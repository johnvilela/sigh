'use server';

import { actionClient } from "@/lib/services/safe-action";
import { MutatePartnerProjectSchema } from "./partner-project-types";
import { partnerProjectService } from "./partner-project-service";
import { actionResponseBuilder } from "@/lib/utils/action-response-builder";

export const mutatePartnerProjectAction = actionClient.schema(MutatePartnerProjectSchema).action(async ({ parsedInput }) => {
  try {
    const { id } = parsedInput;

    const federation = !id ? await partnerProjectService().create(parsedInput) : await partnerProjectService().update(parsedInput);

    return actionResponseBuilder().success(federation);
  } catch (error) {
    if (error instanceof Error) {
      return actionResponseBuilder().error(error.message);
    }

    return actionResponseBuilder().error("Error ao criar projeto");
  }
});

export async function deletePartnerProjectAction (id: string) {
  if (!id) {
    return actionResponseBuilder().error("ID do projeto não fornecido");
  }

  try {
    await partnerProjectService().delete(id);

    return actionResponseBuilder().success("Projeto excluído com sucesso");
  } catch (error) {
    if (error instanceof Error) {
      return actionResponseBuilder().error(error.message);
    }

    return actionResponseBuilder().error("Erro ao excluir projeto");
  }
}