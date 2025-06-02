import db from "@/lib/services/db";
import { GetAllPartnerProjectParams, GetPartnerProjectByIdParams, MutatePartnerProjectDTO } from "./partner-project-types";
import dayjs from "dayjs";

export function partnerProjectService () {
  return {
    async getById ({ id, includeFederation = false, includeTeam = false }: GetPartnerProjectByIdParams) {
      return db.partnerProject.findUnique({
        where: { id },
        include: {
          federation: !!includeFederation,
          team: !!includeTeam,
          address: true,
        }
      });
    },

    async getAll (params: GetAllPartnerProjectParams) {
      const { includeFederation, includeTeam, filters } = params;

      return db.partnerProject.findMany({
        where: {
          ...(filters?.name ? { name: { search: filters?.name } } : {}),
          ...(filters?.teamId ? { teamId: filters?.teamId } : {}),
          ...(filters?.federationId ? { federationId: filters?.federationId } : {}),
        },
        include: {
          federation: !!includeFederation,
          team: !!includeTeam,
          address: true,
        }
      });
    },

    async create (data: MutatePartnerProjectDTO) {
      return db.partnerProject.create({
        data: {
          name: data.name,
          ageGroupStart: Number(data.ageGroupStart),
          ageGroupEnd: Number(data.ageGroupEnd),
          contactName: data.contactName,
          contactPhone: data.contactPhone,
          description: data.description,
          finalDate: dayjs(data.finalDate).toDate(),
          initialDate: dayjs(data.initialDate).toDate(),
          totalPractitioners: Number(data.malePractitioners) + Number(data.femalePractitioners),
          malePractitioners: Number(data.malePractitioners),
          femalePractitioners: Number(data.femalePractitioners),
          teamId: data.teamId || undefined,
          federationId: data.federationId || undefined,
          address: {
            create: {
              city: data.address.city,
              uf: data.address.uf,
              complement: data.address.complement,
            }
          }
        },
      });
    },

    async update (data: MutatePartnerProjectDTO) {
      if (!data.id) {
        throw new Error("ID is required for updating a partner project");
      }

      return db.partnerProject.update({
        where: { id: data.id },
        data: {
          name: data.name,
          ageGroupStart: Number(data.ageGroupStart),
          ageGroupEnd: Number(data.ageGroupEnd),
          contactName: data.contactName,
          contactPhone: data.contactPhone,
          description: data.description,
          finalDate: dayjs(data.finalDate).toDate(),
          initialDate: dayjs(data.initialDate).toDate(),
          totalPractitioners: Number(data.malePractitioners) + Number(data.femalePractitioners),
          malePractitioners: Number(data.malePractitioners),
          femalePractitioners: Number(data.femalePractitioners),
          teamId: data.teamId || undefined,
          federationId: data.federationId || undefined,
          address: {
            update: {
              city: data.address.city,
              uf: data.address.uf,
              complement: data.address.complement,
            }
          }
        },
      });
    },

    async delete (id: string) {
      if (!id) {
        throw new Error("ID is required for deleting a partner project");
      }

      return db.partnerProject.delete({
        where: { id },
      });
    },
  }
}