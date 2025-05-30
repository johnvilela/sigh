import { Sidebar, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import {
  Boxes,
  Component,
  ContactRound,
  CopyCheck,
  FileDown,
  FileUser,
  LayoutDashboard,
  ListCheck,
  Repeat2,
  Shield,
  UserCog,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { ReactElement } from 'react';
import { MenuList } from './menu-list';
import { User, USER_ROLE } from '@/generated/prisma';
import { checkUserRole } from '@/lib/utils/check-user-role';
import { MenuFooter } from './menu-footer';
import { getLoggedUserAction } from '@/lib/modules/user/user-actions';

export type MenuListDataType = {
  [key: string | 'App' | 'Listagens' | 'Interno']: { label: string; href: string; icon: ReactElement }[];
};

function MenuListData (user: User): MenuListDataType {
  let base: MenuListDataType = {
    App: [{ label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard /> }],
    Listagens: [
      { label: 'Atletas', href: '/atletas', icon: <Users /> },
      { label: 'Projetos Parceiros', href: '/projetos-parceiros', icon: <Boxes /> },
      { label: 'Oficiais Técnicos', href: '/oficiais-tecnicos', icon: <ContactRound /> },
      { label: 'Clubes', href: '/clubes', icon: <Shield /> },
      { label: 'Federações', href: '/federacoes', icon: <Component /> },
    ],
  };
  const isAthlete = checkUserRole([USER_ROLE.ATHLETE], user);
  const isAdmin = checkUserRole([USER_ROLE.ADMIN], user);
  const isManager = checkUserRole([USER_ROLE.ADMIN, USER_ROLE.ADMINFEDERATION, USER_ROLE.ADMINTEAM], user);

  if (isAdmin) {
    base = {
      ...base,
      Interno: [
        { label: 'Relatórios', href: '/restrito/relatorio', icon: <FileDown /> },
        { label: 'Usuários do sistema', href: '/restrito/usuarios', icon: <UserCog /> },
      ],
    };
  }

  if (isManager) {
    base = {
      ...base,
      Listagens: [
        ...(base.Listagens ?? []),
        { label: 'Comissão Técnica', href: '/comissao-tecnica', icon: <FileUser /> },
      ],
      Interno: [
        ...(base.Interno ?? []),
        { label: 'Aprovação de atletas', href: '/restrito/aprovacao/atletas', icon: <ListCheck /> },
        { label: 'Aprovação de transferencias', href: '/restrito/aprovacao/transferencia', icon: <CopyCheck /> },
      ],
    };
  }

  if (isAthlete) {
    base.App.push({ label: 'Transferencia', href: '/solicitar-transferencia', icon: <Repeat2 /> });
  }

  return base;
}

export async function AppLayout () {
  const user = await getLoggedUserAction();

  return (
    <Sidebar>
      <SidebarHeader>
        <Image src="/cbhg-logo.png" alt="Logo" width={80} height={44} />
      </SidebarHeader>
      <MenuList data={MenuListData(user!)} />
      <SidebarFooter>
        <MenuFooter user={user!} />
      </SidebarFooter>
    </Sidebar>
  );
}