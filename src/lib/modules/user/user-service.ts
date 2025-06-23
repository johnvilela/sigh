import db from '@/lib/services/db';
import { MutateUserDTO, IFindAllUsersParams, IFindOneUsersParams } from './user-types';
import { USER_ROLE } from '@/generated/prisma';

export function userService () {
  return {
    async create ({ email, name, role, relatedId, id }: MutateUserDTO) {
      if (!email || !name || !id || !role) {
        throw new Error('Todos os campos são obrigatórios');
      }

      const user = await db.user.create({
        data: {
          id,
          email,
          name,
          role,
          federationId: role === USER_ROLE.ADMINFEDERATION ? relatedId : undefined,
          teamId: role === USER_ROLE.ADMINTEAM ? relatedId : undefined,
        },
      });

      return user;
    },
    async findOne ({ id, includeFederation = false, includeTeam = false }: IFindOneUsersParams) {
      if (!id) {
        throw new Error('Usuário ID é obrigatório');
      }

      const user = await db.user.findFirst({
        where: { id },
        include: {
          federation: !!includeFederation,
          team: !!includeTeam,
        }
      });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return user;
    },
    async findAll ({ role, includeFederation, includeTeam, filters = {} }: IFindAllUsersParams) {
      const { name, federationId, teamId } = filters;

      return db.user.findMany({
        where: {
          ...(name ? { name: { contains: name, mode: 'insensitive' } } : {}),
          ...(federationId ? { federationId } : {}),
          ...(teamId ? { teamId } : {}),
          role: { in: role }
        },
        include: {
          federation: !!includeFederation,
          team: !!includeTeam,
        }
      });
    },
    async update (id: string, data: Partial<MutateUserDTO>) {
      if (!id) {
        throw new Error('Usuário ID é obrigatório');
      }

      const user = await db.user.findFirst({ where: { id } });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const updatedUser = await db.user.update({
        where: { id },
        data: {
          ...data,
          federationId: data.role === USER_ROLE.ADMINFEDERATION ? data.relatedId : undefined,
          teamId: data.role === USER_ROLE.ADMINTEAM ? data.relatedId : undefined,
        }
      });

      return updatedUser;
    },
    async delete (id: string) {
      if (!id) {
        throw new Error('Usuário ID é obrigatório');
      }

      const user = await db.user.findFirst({ where: { id } });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      await db.user.delete({ where: { id } });

      return user;
    }
  };
}
