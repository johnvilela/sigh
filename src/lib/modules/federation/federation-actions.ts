'use server';

import { actionClient } from "@/lib/services/safe-action";
import { MutateFederationFormSchema } from "./federation-types";
import { FederationService } from "./federation-service";
import { ActionResponseBuilder } from "@/lib/utils/action-response-builder";

export const MutateFederationAction = actionClient.schema(MutateFederationFormSchema).action(async ({ parsedInput }) => {
  try {
    const { id } = parsedInput;
  
    const federation = !id ? await FederationService().create(parsedInput) : await FederationService().update(parsedInput);

    return ActionResponseBuilder().success(federation);
  } catch (error) {
    if (error instanceof Error) {
      return ActionResponseBuilder().error(error.message);
    }

    return ActionResponseBuilder().error("Error ao criar federação");
  }
});

export async function DeleteFederationAction (id: string) {
  if (!id) {
    return ActionResponseBuilder().error("ID da federação não fornecido");
  }

  try {
    await FederationService().delete(id);

    return ActionResponseBuilder().success("Federação excluída com sucesso");
  } catch (error) {
    if (error instanceof Error) {
      return ActionResponseBuilder().error(error.message);
    }

    return ActionResponseBuilder().error("Erro ao excluir federação");
  }
}