'use server';

import { actionClient } from '@/lib/services/safe-action';
import { cookies } from 'next/headers';
import { actionResponseBuilder } from '@/lib/utils/action-response-builder';
import { credentialService } from '../credential/credential-service';
import { userService } from './user-service';
import { MutateUserSchema } from './user-types';
import { USER_ROLE } from '@/generated/prisma';
import { tokenService } from '../token/token-service';

export const mutateUserAction = actionClient
  .schema(MutateUserSchema)
  .action(async ({ clientInput: { email, name, relatedId, role, id } }) => {
    try {
      if (id) {
        await userService().update(id, {
          email,
          name,
          relatedId,
          role: USER_ROLE[role ?? 'ADMINTEAM'],
        })

        return actionResponseBuilder()
          .success({
            userId: id,
          });
      }

      const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      const password = Array.from(crypto.getRandomValues(new Uint8Array(8)))
        .map(byte => charset[byte % charset.length])
        .join('');

      const credential = await credentialService().create({ email, password });

      const user = await userService().create({
        id: credential.id,
        name,
        email,
        relatedId,
        role: USER_ROLE[role ?? 'ADMINTEAM'],
      });

      const token = await tokenService().create(user.id);

      await userService().update(user.id, {
        newPasswordId: token.id,
      });

      return actionResponseBuilder()
        .success({
          userId: user.id,
        })
    } catch (error) {
      if (error instanceof Error) {
        return actionResponseBuilder().error(error.message);
      }

      return actionResponseBuilder().error('Erro ao criar usuário');
    }
  });

export const deleteUserAction = async (id: string) => {
  try {
    console.log('Deleting user with ID:', id);

    await userService().delete(id);

    return actionResponseBuilder().success('Usuário deletado com sucesso');
  } catch (error) {
    if (error instanceof Error) {
      return actionResponseBuilder().error(error.message);
    }

    return actionResponseBuilder().error('Erro ao deletar usuário');
  }
};

export const getLoggedUserAction = async () => {
  const cookiesStore = await cookies();

  // TODO: adicionar validação de sessão

  const userId = cookiesStore.get('userId')?.value;

  if (!userId) {
    return null;
  }

  const user = await userService().findOne({ id: userId });

  if (!user) {
    return null;
  }

  return user;
};
