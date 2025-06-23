import { Token } from "@/generated/prisma";
import db from "@/lib/services/db";
import { jwtService } from "@/lib/services/jwt-service";
import dayjs from "dayjs";

export function tokenService () {
  return {
    async create (userId: string): Promise<Token> {
      const expiresIn = 1; // Default expiration time
      const expiresInDate = dayjs().add(expiresIn, 'day');
      const token = await jwtService().sign({ expiresIn: `${expiresIn}d`, payload: {} });

      return db.token.create({
        data: {
          token,
          expiresAt: expiresInDate.toDate(),
          userId
        }
      })
    },
    async findById (id: string) {
      return db.token.findUnique({
        where: {
          id
        }
      });
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
          await this.update(tokenRecord.id, false);

          return false;
        }

        return true;
      } catch (error) {
        console.error('Token verification failed:', error);
        return false;
      }
    },
    async update (id: string, isValid: boolean) {
      return db.token.update({
        where: {
          id
        },
        data: {
          isValid
        }
      });
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