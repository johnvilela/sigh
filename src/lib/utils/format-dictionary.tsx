import { USER_STATUS } from '@/generated/prisma';
import dayjs from 'dayjs';

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
};