'use client';

import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../sidebar';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar';
import { ChevronUp, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { User } from '@/generated/prisma';
import { DeleteSessionAction } from '@/lib/modules/session/session-actions';

export function MenuFooter ({ user }: { user: User }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <Avatar>
                {user?.photoUrl ? (
                  <AvatarImage src={user?.photoUrl} alt={user.name} />
                ) : (
                  <AvatarFallback>
                    <UserIcon size={16} />
                  </AvatarFallback>
                )}
              </Avatar>{' '}
              {user?.name || 'Nome do usuário'}
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
            <DropdownMenuItem asChild>
              <Link href="/perfil">Meu Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => DeleteSessionAction()}>
              <span className="text-destructive">Sair da conta</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}