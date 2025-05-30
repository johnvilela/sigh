import db from "@/lib/services/db";
import { MutateFederationFormDTO, GetAllFederationParameter, GetFederationByIdParams } from "./federation-types";
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
    async create (data: MutateFederationFormDTO) {
      return db.federation.create({
        data: {
          ...data,
          beginningOfTerm: dayjs(data.beginningOfTerm).toDate(),
          endOfTerm: dayjs(data.endOfTerm).toDate(),
        },
      });
    },
    async update (data: MutateFederationFormDTO) {
      if (!data.id) {
        throw new Error("ID is required for updating a federation");
      }

      return db.federation.update({
        where: { id: data.id },
        data: {
          ...data,
          beginningOfTerm: dayjs(data.beginningOfTerm).toDate(),
          endOfTerm: dayjs(data.endOfTerm).toDate(),
        },
      });
    },
    async delete (id: string) {
      if (!id) {
        throw new Error("ID is required for deleting a federation");
      }

      return db.federation.delete({
        where: { id },
      });
    },
  }
}