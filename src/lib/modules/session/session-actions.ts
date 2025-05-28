'use server';

import { actionClient } from '@/lib/services/safe-action';
import { CreateSessionSchema } from './session-types';
import { SessionService } from './session-service';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { ActionResponseBuilder } from '@/lib/utils/action-response-builder';

export const CreateSessionAction = actionClient
  .schema(CreateSessionSchema)
  .action(async ({ clientInput: { email, password } }) => {
    let canRedirect = false;

    try {
      const session = await SessionService().create({ email, password });

      const cookiesStore = await cookies();

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
        value: session.userId,
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

      return ActionResponseBuilder().error('Erro ao criar sessão');
    }

    if (canRedirect) {
      redirect('/dashboard');
    } else {
      return ActionResponseBuilder().error('Erro ao criar sessão');
    }
  });

export const DeleteSessionAction = async () => {
  const cookiesStore = await cookies();
  const sessionId = cookiesStore.get('sessionId')?.value;

  if (sessionId) {
    await SessionService().delete(sessionId);
  }

  cookiesStore.delete('userId');
  cookiesStore.delete('sessionId');

  redirect('/login');
};

export const ValidateSessionAction = async () => {
  const cookiesStore = await cookies();
  const sessionId = cookiesStore.get('sessionId')?.value;

  if (!sessionId) {
    redirect('/login');
  }

  let canRedirect = false;

  try {
    const session = await SessionService().checkIfValid(sessionId);

    canRedirect = !session;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    canRedirect = true;
  }

  if (canRedirect) {
    redirect('/login');
  }
};
