'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAction } from 'next-safe-action/hooks';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectWrapper } from '../ui/select';
import { MutateUserSchema } from '@/lib/modules/user/user-types';
import { mutateUserAction } from '@/lib/modules/user/user-actions';
import { Federation, Team, User, USER_ROLE } from '@/generated/prisma';
import { userRoleDictionary } from '@/lib/dictionary/user-roles-dictionary';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface IRestrictUserFormProps {
  federations?: Pick<Federation, 'id' | 'name' | 'initials'>[];
  teams?: Pick<Team, 'id' | 'name' | 'initials'>[];
  user?: User;
  isEditing?: boolean
}

type CreateUserFormType = Omit<z.infer<typeof MutateUserSchema>, 'newPasswordId'>

export function RestrictUserForm ({ federations, teams, user, isEditing = false }: IRestrictUserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<CreateUserFormType>({
    resolver: zodResolver(MutateUserSchema.omit({ newPasswordId: true })),
    defaultValues: {
      email: user?.email,
      name: user?.name,
      role: user?.role && user.role !== 'ATHLETE' ? USER_ROLE[user.role] : USER_ROLE.ADMINTEAM,
      relatedId: user?.federationId || user?.teamId || undefined
    }
  });
  const { push } = useRouter()
  const { execute, isExecuting, result } = useAction(mutateUserAction);

  function renderTeamsSelect () {
    if (teams?.length === 0) {
      return (
        <SelectItem value="" disabled>
          Nenhuma equipe cadastrada
        </SelectItem>
      )
    }

    return teams?.map(team => (
      <SelectItem key={team.id} value={team.id}>
        {team.name}
      </SelectItem>
    ));
  }

  function renderFederationsSelect () {
    if (federations?.length === 0) {
      return (
        <SelectItem value="" disabled>
          Nenhuma federação cadastrada
        </SelectItem>
      )
    }
    return federations?.map(federation => (
      <SelectItem key={federation.id} value={federation.id}>
        {federation.initials} - {federation.name}
      </SelectItem>
    ));
  }

  function renderRelatedSelect () {
    const role = watch('role');

    if (role === USER_ROLE.ADMINTEAM || role === USER_ROLE.ADMINFEDERATION) {
      return (
        <Controller
          control={control}
          name="relatedId"
          render={({ field: { onChange, value } }) => {
            const label = role === USER_ROLE.ADMINTEAM ? 'Clube' : 'Federação';
            return (
              <SelectWrapper name='relatedId' className="md:col-span-2 max-w-none" label={label}>
                <Select onValueChange={onChange} value={value} defaultValue={value}>
                  <SelectTrigger className="w-full" id="relatedId" name='relatedId'>
                    <SelectValue placeholder={`Escolha uma ${label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {role === USER_ROLE.ADMINTEAM && renderTeamsSelect()}
                      {role === USER_ROLE.ADMINFEDERATION && renderFederationsSelect()}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </SelectWrapper>
            )
          }}
        />
      )
    }

    if (role === USER_ROLE.ADMIN) return <Input label="Relacionado" value={'CBHG - Administração'} name="relatedId" divClassName='max-w-none' disabled />;

    return <></>;
  }

  useEffect(() => {
    if (result.data?.status === 'success') push('/restrito/usuarios');
  }, [push, result.data?.status])

  return (
    <form className="max-w-3xl mx-auto" onSubmit={handleSubmit(data => execute({
      ...data,
      id: isEditing ? user?.id : undefined,
    }))}>
      {result.data?.status === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{'Erro ao criar usuário do sistema'}</AlertDescription>
        </Alert>
      )}
      <fieldset className='mb-8'>
        <legend className='scroll-m-20 text-xl font-semibold'>Dados do usuário</legend>
        <Input label="Name" error={errors.name?.message} divClassName='max-w-none' {...register('name')} />
        <Input type="email" label="Email" error={errors.email?.message} divClassName='max-w-none' {...register('email')} />
        <Controller
          control={control}
          name="role"
          render={({ field: { onChange, value } }) => (
            <SelectWrapper name='role' className="md:col-span-2 max-w-none" label="Tipo de usuário">
              <Select onValueChange={onChange} value={value} defaultValue={value}>
                <SelectTrigger className="w-full" id="role" name='role'>
                  <SelectValue placeholder="Escolha um tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.keys(USER_ROLE).filter(key => key !== 'ATHLETE').map(role => (
                      <SelectItem key={role} value={role}>
                        {userRoleDictionary[role as USER_ROLE]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </SelectWrapper>
          )}
        />
        {renderRelatedSelect()}
      </fieldset>
      <div className="flex justify-end mt-4">
        <Button type="submit" isLoading={isExecuting}>
          {isEditing ? 'Editar' : 'Criar'} usuário
        </Button>
      </div>
    </form>
  );
}
