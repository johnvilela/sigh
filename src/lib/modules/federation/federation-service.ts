import db from "@/lib/services/db";
import { CreateFederationFormDTO, GetAllFederationParameter, GetFederationByIdParams } from "./federation-types";
import dayjs from "dayjs";

export function FederationService () {
  return {
    async getById ({ id, includeAthletes = false, includeTeams = false, includeUsers = false }: GetFederationByIdParams) {
      return db.federation.findUnique({
        where: {
          id,
        },
        include: {
          ...(includeTeams ? { teams: true } : null),
          ...(includeAthletes ? { teams: { include: { users: true } } } : null),
          users: includeUsers,
        },
      });
    },
    async getAll (params?: GetAllFederationParameter) {
      const { name } = params || {};
      const where = name ? { name: { search: name } } : {};

      return db.federation.findMany({
        where,
      });
    },
    async getAllSmall () {
      return db.federation.findMany({
        select: {
          id: true,
          name: true,
          initials: true,
        },
      });
    },
    async create (data: CreateFederationFormDTO) {
      return db.federation.create({
        data: {
          ...data,
          beginningOfTerm: dayjs(data.beginningOfTerm).toDate(),
          endOfTerm: dayjs(data.endOfTerm).toDate(),
        },
      });
    }
  }
}