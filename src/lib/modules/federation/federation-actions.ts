'use server';

import { actionClient } from "@/lib/services/safe-action";
import { MutateFederationFormSchema } from "./federation-types";
import { federationService } from "./federation-service";
import { actionResponseBuilder } from "@/lib/utils/action-response-builder";

export const mutateFederationAction = actionClient.schema(MutateFederationFormSchema).action(async ({ parsedInput }) => {
  try {
    const { id } = parsedInput;
  
    const federation = !id ? await federationService().create(parsedInput) : await federationService().update(parsedInput);

    return actionResponseBuilder().success(federation);
  } catch (error) {
    if (error instanceof Error) {
      return actionResponseBuilder().error(error.message);
    }

    return actionResponseBuilder().error("Error ao criar federação");
  }
});

export async function deleteFederationAction (id: string) {
  if (!id) {
    return actionResponseBuilder().error("ID da federação não fornecido");
  }

  try {
    await federationService().delete(id);

    return actionResponseBuilder().success("Federação excluída com sucesso");
  } catch (error) {
    if (error instanceof Error) {
      return actionResponseBuilder().error(error.message);
    }

    return actionResponseBuilder().error("Erro ao excluir federação");
  }
}