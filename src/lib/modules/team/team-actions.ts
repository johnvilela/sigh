'use server';

import { actionClient } from "@/lib/services/safe-action";
import { MutateTeamFormSchema } from "./team-types";
import { actionResponseBuilder } from "@/lib/utils/action-response-builder";
import { teamService } from "./team-service";

export const mutatetTeamAction = actionClient.schema(MutateTeamFormSchema).action(async ({ parsedInput }) => {
  try {
    const { id } = parsedInput;

    const federation = !id ? await teamService().create(parsedInput) : await teamService().update(parsedInput);

    return actionResponseBuilder().success(federation);
  } catch (error) {
    if (error instanceof Error) {
      return actionResponseBuilder().error(error.message);
    }

    return actionResponseBuilder().error("Error ao criar clube");
  }
});

export async function deleteTeamAction (id: string) {
  if (!id) {
    return actionResponseBuilder().error("ID do clube não fornecido");
  }

  try {
    await teamService().delete(id);

    return actionResponseBuilder().success("Clube excluído com sucesso");
  } catch (error) {
    if (error instanceof Error) {
      return actionResponseBuilder().error(error.message);
    }

    return actionResponseBuilder().error("Erro ao excluir clube");
  }
}