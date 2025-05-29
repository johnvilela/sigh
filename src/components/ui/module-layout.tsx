import { Fragment, ReactNode } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator, BreadcrumbLink } from './breadcrumb';
import { SidebarTrigger } from './sidebar';

interface IBasicModulesLayoutProps {
  children: ReactNode;
  breadcrumbItems?: Array<{
    label: string;
    href?: string;
  }>;
}

export function ModuleLayout ({ children, breadcrumbItems }: IBasicModulesLayoutProps) {
  return (
    <>
      <div className="flex gap-2 items-center mb-4">
        <SidebarTrigger />
        {breadcrumbItems && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item, index) => (
                <Fragment key={item.label}>
                  <BreadcrumbItem>
                    {item.href ? <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink> : item.label}
                  </BreadcrumbItem>
                  {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>
      <div>{children}</div>
    </>
  );
}