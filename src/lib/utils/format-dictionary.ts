import { USER_STATUS } from '@/generated/prisma';
import dayjs from 'dayjs';
import { userRoleDictionary } from '../dictionary/user-roles-dictionary';

export const formatDictionary = {
  DATE: (value: Date | string) => dayjs(value).format('DD/MM/YYYY'),
  STATUS: (value: USER_STATUS) => {
    switch (value) {
      case 'ACTIVE':
        return 'Ativo';
      case 'INACTIVE':
        return 'Inativo';
      case 'PENDING':
      default:
        return 'Pendente';
    }
  },
  USER_ROLE: (value: string) => {
    return userRoleDictionary[value as keyof typeof userRoleDictionary] || 'Desconhecido';
  },
};