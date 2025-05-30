import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import { federationService } from '@/lib/modules/federation/federation-service';
import { ModuleLayout } from '@/components/ui/module-layout';
import { USER_ROLE } from '@/generated/prisma';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default async function FederationDetailsPage ({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const federation = await federationService().getById({ id, includeTeams: true, includeAthletes: true });

  function renderTermDate () {
    if (!federation?.beginningOfTerm || !federation?.endOfTerm) return 'Sem dados do mandato';

    return `${dayjs(federation?.beginningOfTerm).format('DD/MM/YYYY')} - ${dayjs(federation?.endOfTerm).format('DD/MM/YYYY')}`;
  }

  // TODO: get users by an endpoint to use paginate
  // @ts-expect-error - users is not defined on current type
  const users = federation?.teams.map((team) => team.users).flat() as User[];

  if (!federation) {
    return (
      <ModuleLayout
        breadcrumbItems={[
          { label: 'Federações', href: '/federacoes' },
          { label: 'Não encontrado', href: `/federacoes` },
        ]}
      >
        <Alert>
          <AlertTitle>Federação não encontrada</AlertTitle>
          <AlertDescription>
            <span>Não foi possível encontrar a federação com o ID <strong>{id}</strong>.</span>
          </AlertDescription>
        </Alert>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout
      breadcrumbItems={[
        { label: 'Federações', href: '/federacoes' },
        { label: federation!.initials!, href: `/federacoes/${federation!.id}` },
      ]}
    >
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <Image
              src={federation!.logo! || '/image-not-found.png'}
              alt={'Logo da federação'}
              width={96}
              height={96}
              className="rounded-md p-1 w-24 h-24 object-contain border"
            />

            <div>
              <h2 className="font-bold text-lg">{federation?.name}</h2>
              <p className="opacity-80">{federation?.initials}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="md:pl-32">
            <strong>Presidente: </strong>
            {federation?.presidentName}
            <br />
            <strong>Mandato: </strong>
            {renderTermDate()}
          </p>
          <Separator className="my-8" />
          <Tabs defaultValue="teams" className="w-full">
            <TabsList>
              <TabsTrigger value="teams">Clubes</TabsTrigger>
              <TabsTrigger value="athletes">Atletas</TabsTrigger>
            </TabsList>
            <TabsContent value="teams">
              <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {federation?.teams?.map((team) => (
                  <li key={team.id} className="w-full h-full">
                    <Link
                      href={`/app/clubes/${team.id}`}
                      className=" bg-background flex gap-2 w-full h-full p-4 md:border-r hover:brightness-95 duration-200"
                    >
                      <Image
                        src={team!.logo! || '/image-not-found.png'}
                        alt={'Logo do clube'}
                        width={48}
                        height={48}
                        className="rounded-md p-1 w-12 h-12 object-contain border"
                      />

                      <div className="flex-1">
                        <strong>{team.name}</strong>
                        <p>{team.initials}</p>
                        <p className="text-xs text-right opacity-70">Ver mais</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="athletes">
              <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {users
                  ?.filter((user) => user.role === USER_ROLE.ATHLETE)
                  .map((user) => (
                    <li key={user.id}>
                      <Link
                        href={`/app/atleta/${user.id}`}
                        className=" bg-background flex gap-2 p-4 md:border-r hover:brightness-95 duration-200 box-content"
                      >
                        <Image
                          src={user!.photoUrl! || '/image-not-found.png'}
                          defaultValue={'/image-not-found.png'}
                          alt={'Logo do clube'}
                          width={48}
                          height={48}
                          className="rounded-md p-1 w-12 h-12 object-cover border"
                        />

                        <div className="flex-1 truncate">
                          <strong>{user.name}</strong>
                          <p className="text-sm truncate">
                            {user.email}
                            {user.email}
                          </p>
                          <p className="text-xs text-right opacity-70">Ver mais</p>
                        </div>
                      </Link>
                    </li>
                  ))}
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </ModuleLayout>
  );
}