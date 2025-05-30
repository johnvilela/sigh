import db from "@/lib/services/db";
import { GetAllSmallTeamsParams, GetAllTeamsParams, GetTeamByIdParams } from "./team-types";



export function teamService () {
  async function getById ({ id, includeAthletes = false, includeFederation = false }: GetTeamByIdParams) {
    return db.team.findUnique({
      where: {
        id,
      },
      include: {
        users: includeAthletes,
        federation: includeFederation,
      },
    });
  }

  async function getAll ({ includeFederation, includeUsers, filter }: GetAllTeamsParams) {
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
  }

  async function getAllSmall (params?: GetAllSmallTeamsParams) {
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
  }

  return {
    getById,
    getAll,
    getAllSmall,
  };
}
