import { hashService } from '@/lib/services/hash-service';
import { CreateCredentialDTO, ValidateCredentialDTO } from './credential-types';
import db from '@/lib/services/db';

export function credentialService () {
  return {
    async create({ email, password }: CreateCredentialDTO) {
      const hashedPassword = await hashService().hash(password);

      return db.credential.create({ data: { email, password: hashedPassword } });
    },
    async validate({ email, password }: ValidateCredentialDTO) {
      const credential = await db.credential.findFirst({ where: { email } });

      if (!credential) {
        throw new Error('Email não encontrado');
      }

      const isValid = await hashService().compare(password, credential.password);

      if (!isValid) {
        throw new Error('Senha inválida');
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete credential.password;

      return credential;
    },
  };
}
