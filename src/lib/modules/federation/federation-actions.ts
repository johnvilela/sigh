'use server';

import { actionClient } from "@/lib/services/safe-action";
import { CreateFederationFormSchema } from "./federation-types";
import { FederationService } from "./federation-service";
import { ActionResponseBuilder } from "@/lib/utils/action-response-builder";

export const CreateFederationAction = actionClient.schema(CreateFederationFormSchema).action(async ({ parsedInput }) => {
  try {
    const federation = await FederationService().create(parsedInput);

    return ActionResponseBuilder().success(federation);
  } catch (error) {
    if (error instanceof Error) {
      return ActionResponseBuilder().error(error.message);
    }

    return ActionResponseBuilder().error("Error ao criar federação");
  }
});