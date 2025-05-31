import db from "@/lib/services/db";
import { GetAllSmallTeamsParams, GetAllTeamsParams, GetTeamByIdParams, MutateTeamFormDTO } from "./team-types";
import dayjs from "dayjs";

export function teamService () {
  return {
    async getById ({ id, includeAthletes = false, includeFederation = false }: GetTeamByIdParams) {
      return db.team.findUnique({
        where: {
          id,
        },
        include: {
          users: includeAthletes,
          federation: includeFederation,
        },
      });
    },
    async getAll ({ includeFederation, includeUsers, filter }: GetAllTeamsParams) {
      const AND = [];

      if (filter?.name) {
        AND.push({
          name: {
            search: filter.name,
          },
        });
      }

      if (filter?.federationId) {
        AND.push({
          federationId: filter.federationId,
        });
      }

      return db.team.findMany({
        where: {
          AND,
        },
        include: {
          federation: includeFederation,
          users: includeUsers,
        },
      });
    },
    async getAllSmall (params?: GetAllSmallTeamsParams) {
      const AND = [];

      if (params?.filter?.federationId) {
        AND.push({
          federationId: params.filter.federationId,
        });
      }

      return db.team.findMany({
        where: {
          AND,
        },
        select: {
          id: true,
          name: true,
          initials: true,
        },
      });
    },
    async create (data: MutateTeamFormDTO) {
      return db.team.create({
        data: {
          ...data,
          beginningOfTerm: data.beginningOfTerm ? new Date(data.beginningOfTerm) : null,
          endOfTerm: data.endOfTerm ? new Date(data.endOfTerm) : null,
        },
      });
    },
    async update (data: MutateTeamFormDTO) {
      if (!data.id) {
        throw new Error("ID is required for updating a team");
      }

      return db.team.update({
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
        throw new Error("ID is required for deleting a team");
      }

      return db.team.delete({
        where: { id },
      });
    },
  };
}
