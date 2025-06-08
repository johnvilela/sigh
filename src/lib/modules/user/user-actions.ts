'use server';

import { actionClient } from '@/lib/services/safe-action';
import { cookies } from 'next/headers';
import { actionResponseBuilder } from '@/lib/utils/action-response-builder';
import { credentialService } from '../credential/credential-service';
import { userService } from './user-service';
import { CreateUserSchema } from './user-types';
import { USER_ROLE } from '@/generated/prisma';
import { tokenService } from '../token/token-service';

export const createUserAction = actionClient
  .schema(CreateUserSchema)
  .action(async ({ clientInput: { email, name, teamId, federationId, role } }) => {
    try {
      const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      const password = Array.from(crypto.getRandomValues(new Uint8Array(8)))
        .map(byte => charset[byte % charset.length])
        .join('');

      const credential = await credentialService().create({ email, password });

      const user = await userService().create({
        id: credential.id,
        name: name,
        email: email,
        federationId: federationId,
        teamId: teamId,
        role: USER_ROLE[role ?? 'ADMINTEAM'],
      });

      const token = await tokenService().create(user.id);

      return actionResponseBuilder()
        .success({
          url: `${process.env.NEXT_PUBLIC_APP_URL}/mudar-senha?token=${token}`,
        })
    } catch (error) {
      if (error instanceof Error) {
        return actionResponseBuilder().error(error.message);
      }
    }
  });

export const getLoggedUserAction = async () => {
  const cookiesStore = await cookies();

  // TODO: adicionar validação de sessão

  const userId = cookiesStore.get('userId')?.value;

  if (!userId) {
    return null;
  }

  const user = await userService().findOne(userId);

  if (!user) {
    return null;
  }

  return user;
};
