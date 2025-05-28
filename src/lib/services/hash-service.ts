import bcrypt from 'bcrypt';

export function hashService() {
  return {
    hash: async (input: string) => {
      const saltRounds = 10;

      return bcrypt.hash(input, saltRounds);
    },
    compare: async (input: string, hashed: string) => {
      return bcrypt.compare(input, hashed);
    },
  };
}
