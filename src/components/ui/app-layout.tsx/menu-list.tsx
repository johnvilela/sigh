'use client';

import Link from 'next/link';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../sidebar';
import { MenuListDataType } from '.';
import { usePathname } from 'next/navigation';

export function MenuList ({ data }: { data: MenuListDataType }) {
  const pathName = usePathname();

  function checkIsActive (href: string) {
    return pathName === href;
  }

  return (
    <SidebarContent>
      {Object.keys(data).map((group) => (
        <SidebarGroup key={group}>
          <SidebarGroupLabel>{group}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data[group].map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton isActive={checkIsActive(item.href)} asChild>
                    <Link href={item.href}>
                      {item.icon}
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </SidebarContent>
  );
}