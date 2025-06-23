'use server';

import { actionResponseBuilder } from "@/lib/utils/action-response-builder";
import { redirect } from "next/navigation";
import { sessionService } from "../session/session-service";
import { credentialService } from "../credential/credential-service";
import { cookies } from "next/headers";
import { actionClient } from "@/lib/services/safe-action";
import { CreateAthleteSchema } from "./athlete-types";
import { athleteService } from "./athlete-service";

export const createAthleteAction = actionClient
  .schema(CreateAthleteSchema)
  .action(async ({ clientInput: { email, birthDate, document, name, teamId, password } }) => {
    let canRedirect = false;

    try {
      const cookiesStore = await cookies();

      const credential = await credentialService().create({ email, password });

      const user = await athleteService().create({
        id: credential.id,
        name: name,
        email: email,
        document: document,
        birthDate: birthDate,
        teamId: teamId,
      });

      const session = await sessionService().create({ email, password });

      cookiesStore.set({
        name: 'sessionId',
        value: session.id,
        httpOnly: true,
        expires: session.expiresAt,
        priority: 'high',
        secure: process.env.NODE_ENV === 'production',
      });
      cookiesStore.set({
        name: 'userId',
        value: user.id,
        httpOnly: true,
        expires: session.expiresAt,
        priority: 'high',
        secure: process.env.NODE_ENV === 'production',
      });

      canRedirect = true;
    } catch (error) {
      if (error instanceof Error) {
        return actionResponseBuilder().error(error.message);
      }
    }

    if (canRedirect) {
      redirect('/dashboard');
    } else {
      return actionResponseBuilder().error('Error ao criar atleta');
    }
  });
