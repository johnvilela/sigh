import dayjs from 'dayjs';
import { CreateSessionDTO } from './session-types';
import { credentialService } from '../credential/credential-service';
import db from '@/lib/services/db';

export function sessionService () {
  const EXPIRES_AT = Number(process.env.SESSION_EXPIRES_AT_DAYS!) || 1;

  return {
    async create ({ email, password }: CreateSessionDTO) {
      const credential = await credentialService().validate({ email, password });

      if (!credential) {
        throw new Error('Credenciais inválidas');
      }

      const expiresAt = dayjs().add(EXPIRES_AT, 'day').toDate();

      return db.session.create({ data: { userId: credential.id, expiresAt } });
    },
    async checkIfValid (id: string) {
      if (!id) {
        throw new Error('Id da sessão é obrigatório');
      }

      const session = await db.session.findFirst({ where: { id } });

      if (!session) {
        throw new Error('Id da sessão não encontrada');
      }

      const now = dayjs();
      const expiresAt = dayjs(session.expiresAt);

      if (expiresAt.isBefore(now)) {
        await db.session.update({
          where: { id },
          data: { isValid: false },
        });

        throw new Error('Sessão expirada');
      }

      return session;
    },
    async delete (id: string) {
      if (!id) {
        throw new Error('Id da sessão é obrigatório');
      }

      const session = await db.session.findFirst({ where: { id } });

      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      await db.session.delete({ where: { id } });
    },
  };
}
