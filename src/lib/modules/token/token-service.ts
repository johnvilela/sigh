import db from "@/lib/services/db";
import { jwtService } from "@/lib/services/jwt-service";
import dayjs from "dayjs";

export function tokenService () {
  return {
    async create (userId: string): Promise<string> {
      const expiresIn = 1; // Default expiration time
      const expiresInDate = dayjs().add(expiresIn, 'day');
      const token = await jwtService().sign({ expiresIn: `${expiresIn}d`, payload: {} });

      await db.token.create({
        data: {
          token,
          expiresAt: expiresInDate.toDate(),
          userId
        }
      })

      return token;
    },
    async getAllByUserId (userId: string) {
      return db.token.findMany({
        where: {
          userId
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    },
    async verify (token: string): Promise<boolean> {
      try {
        const isValid = await jwtService().verify(token);

        if (!isValid) return false;

        const tokenRecord = await db.token.findUnique({
          where: {
            token
          }
        });

        if (!tokenRecord) return false;

        if (dayjs(tokenRecord.expiresAt).isBefore(dayjs())) {
          return false;
        }

        return true;
      } catch (error) {
        console.error('Token verification failed:', error);
        return false;
      }
    },
    async deleteById (id: string) {
      return db.token.delete({
        where: {
          id
        }
      });
    },
  }
}