import { ModuleLayout } from '@/components/ui/module-layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { teamService } from '@/lib/modules/team/team-service';
import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import { USER_ROLE } from '@/generated/prisma';

export default async function TeamDetailsPage ({ params }: { params: { id: string } }) {
  const { id } = await params;
  const team = await teamService().getById({ id, includeAthletes: true });

  function renderTermDate () {
    if (!team?.beginningOfTerm || !team?.endOfTerm) return 'Sem dados do mandato';

    return `${dayjs(team?.beginningOfTerm).format('DD/MM/YYYY')} - ${dayjs(team?.endOfTerm).format('DD/MM/YYYY')}`;
  }

  return (
    <ModuleLayout
      breadcrumbItems={[
        { label: 'Clubes', href: '/app/clubes' },
        { label: team!.name!, href: `/app/clubes/${team!.id}` },
      ]}
    >
      <Card className='max-w-4xl mx-auto'>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <Image
              src={team!.logo! || '/image-not-found.png'}
              alt={'Logo da federação'}
              width={96}
              height={96}
              className="rounded-md p-1 w-24 h-24 object-contain border"
            />

            <div>
              <h2 className="font-bold text-lg">{team?.name}</h2>
              <p className="opacity-80">{team?.initials}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="md:pl-32">
            <strong>Presidente: </strong>
            {team?.presidentName}
            <br />
            <strong>Mandato: </strong>
            {renderTermDate()}
          </p>
          <Separator className="my-8" />
          <Tabs defaultValue="athletes" className="w-full">
            <TabsList>
              <TabsTrigger value="athletes">Atletas</TabsTrigger>
            </TabsList>
            <TabsContent value="athletes">
              <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {team?.users
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
