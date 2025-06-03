import { USER_ROLE } from "@/generated/prisma";
import db from "@/lib/services/db";
import dayjs from "dayjs";
import { CreateAthleteDTO } from "./athlete-types";

export function athleteService () {
  return {
    async create ({ birthDate, document, email, name, id, teamId }: CreateAthleteDTO) {
      if (!birthDate || !document || !email || !name || !id || !teamId) {
        throw new Error('Todos os campos são obrigatórios');
      }

      const user = await db.user.create({
        data: {
          id,
          birthDate: dayjs(birthDate).toDate(),
          document,
          email,
          name,
          teamId,
          role: USER_ROLE.ATHLETE,
        },
      });

      return user;
    },
  }
}