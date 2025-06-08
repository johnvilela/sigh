import db from '@/lib/services/db';
import { CreateUserDTO } from './user-types';


export function userService () {
  return {
    async create ({ email, name, role, federationId, teamId, id }: CreateUserDTO) {
      if (!email || !name || !id || !role) {
        throw new Error('Todos os campos são obrigatórios');
      }

      const user = await db.user.create({
        data: {
          id,
          email,
          name,
          role,
          federationId: federationId ? federationId : undefined,
          teamId: teamId ? teamId : undefined,
        },
      });

      return user;
    },
    async findOne (id: string) {
      if (!id) {
        throw new Error('Usuário ID é obrigatório');
      }

      const user = await db.user.findFirst({ where: { id } });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return user;
    },
  };
}
