import db from '@/lib/services/db';
import { CreateUserDTO } from './user-types';
import { USER_ROLE } from '@/generated/prisma';
import dayjs from 'dayjs';

export function UserService () {
  return {
    async create ({ birthDate, document, email, name, id }: CreateUserDTO) {
      if (!birthDate || !document || !email || !name || !id) {
        throw new Error('Todos os campos são obrigatórios');
      }

      const user = await db.user.create({
        data: {
          id,
          birthDate: dayjs(birthDate).toDate(),
          document,
          email,
          name,
          role: USER_ROLE.ATHLETE,
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
