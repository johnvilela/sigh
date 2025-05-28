'use server';

import { actionClient } from '@/lib/services/safe-action';
import { SessionService } from '../session/session-service';
import { cookies } from 'next/headers';
import { ActionResponseBuilder } from '@/lib/utils/action-response-builder';
import { redirect } from 'next/navigation';
import { CredentialService } from '../credential/credential-service';
import { UserService } from './user-service';
import { CreateUserSchema } from './user-types';

export const CreateUserAction = actionClient
  .schema(CreateUserSchema)
  .action(async ({ clientInput: { email, birthDate, document, name, teamId, password } }) => {
    let canRedirect = false;

    try {
      const cookiesStore = await cookies();

      const credential = await CredentialService().create({ email, password });

      const user = await UserService().create({
        id: credential.id,
        name: name,
        email: email,
        document: document,
        birthDate: birthDate,
        teamId: teamId,
      });

      const session = await SessionService().create({ email, password });

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
        return ActionResponseBuilder().error(error.message);
      }
    }

    if (canRedirect) {
      redirect('/dashboard');
    } else {
      return ActionResponseBuilder().error('Error ao criar usuário');
    }
  });

export const GetLoggedUserAction = async () => {
  const cookiesStore = await cookies();

  // TODO: adicionar validação de sessão

  const userId = cookiesStore.get('userId')?.value;

  if (!userId) {
    return null;
  }

  const user = await UserService().findOne(userId);

  if (!user) {
    return null;
  }

  return user;
};
