'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAction } from 'next-safe-action/hooks';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import { MutatePartnerProjectSchema } from '@/lib/modules/partner-project/partner-project-types';
import { mutatePartnerProjectAction } from '@/lib/modules/partner-project/partner-project-actions';
import { PartnerProject, User } from '@/generated/prisma';
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";
import { Text } from '../ui/text';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectWrapper } from '../ui/select';
import { staticBrazilianStates } from '@/lib/utils/static-brazilian-states';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

dayjs.extend(utc)

interface PartnerProjectFormProps {
  partnerProject?: PartnerProject & { address?: { city: string; uf: string; complement: string } };
  user?: User;
  isEditing?: boolean;
}

export function PartnerProjectForm ({ partnerProject, user, isEditing }: PartnerProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<z.infer<typeof MutatePartnerProjectSchema>>({
    resolver: zodResolver(MutatePartnerProjectSchema),
    defaultValues: {
      name: partnerProject?.name || '',
      ageGroupStart: partnerProject?.ageGroupStart.toString() || '0',
      ageGroupEnd: partnerProject?.ageGroupEnd.toString() || '0',
      description: partnerProject?.description || '',
      initialDate: dayjs.utc(partnerProject?.initialDate).format('YYYY-MM-DD') || '',
      finalDate: dayjs.utc(partnerProject?.finalDate).format('YYYY-MM-DD') || '',
      contactName: partnerProject?.contactName || '',
      contactPhone: partnerProject?.contactPhone || '',
      femalePractitioners: partnerProject?.femalePractitioners.toString() || '0',
      malePractitioners: partnerProject?.malePractitioners.toString() || '0',
      address: {
        city: partnerProject?.address?.city || '',
        uf: partnerProject?.address?.uf || '',
        complement: partnerProject?.address?.complement || '',
      }
    }
  });
  const { execute, isExecuting, result } = useAction(mutatePartnerProjectAction);
  const { push } = useRouter()

  useEffect(() => {
    if (result.data?.status === 'success') push('/projetos-parceiros')
  }, [push, result.data?.status])

  return (
    <form className="max-w-3xl mx-auto" onSubmit={handleSubmit(async (data) => {
      await execute({
        ...data,
        id: isEditing ? partnerProject?.id : undefined,
        federationId: user?.federationId || '',
        teamId: user?.teamId || '',
      })
    })}>
      {result.data?.status === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{'Erro ao criar Projeto Parceiro'}</AlertDescription>
        </Alert>
      )}
      <fieldset className='mb-8'>
        <legend className='scroll-m-20 text-xl font-semibold'>Dados do projeto</legend>
        <Input label="Nome" divClassName='max-w-none' error={errors.name?.message} {...register('name')} />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
          <Input
            type="date"
            divClassName="md:col-span-1 max-w-none"
            label="Data do início"
            error={errors.initialDate?.message}
            {...register('initialDate')}
          />
          <Input
            type="date"
            divClassName="md:col-span-1 max-w-none"
            label="Data do fim"
            error={errors.finalDate?.message}
            {...register('finalDate')}
          />
          <Input
            type='number'
            label="Participantes masculinos"
            divClassName="md:col-span-1 max-w-none"
            error={errors.malePractitioners?.message}
            {...register('malePractitioners')} />
          <Input
            type='number'
            label="Participantes femininos"
            divClassName="md:col-span-1 max-w-none"
            error={errors.femalePractitioners?.message}
            {...register('femalePractitioners')} />
          <Text className='md:col-span-2 text-sm text-muted-foreground'>
            Cadastre a faixa etária do projeto parceiro. A faixa etária é obrigatória.
          </Text>
          <Input
            type='number'
            label="Idade mínima"
            divClassName="md:col-span-1 max-w-none"
            error={errors.ageGroupStart?.message}
            {...register('ageGroupStart')} />
          <Input
            type='number'
            label="Idade máxima"
            divClassName="md:col-span-1 max-w-none"
            error={errors.ageGroupEnd?.message}
            {...register('ageGroupEnd')} />
          <Textarea
            label="Descrição"
            divClassName="md:col-span-2 max-w-none"
            error={errors.description?.message}
            {...register('description')}
          />
        </div>
      </fieldset>
      <fieldset className='grid grid-cols-2 gap-2 mb-8'>
        <legend className='scroll-m-20 text-xl font-semibold'>Dados de contato</legend>
        <Input label="Nome do contato" divClassName="md:col-span-1 max-w-none" error={errors.contactName?.message} {...register('contactName')} />
        <Input label="Telefone do contato" divClassName="md:col-span-1 max-w-none" error={errors.contactPhone?.message} {...register('contactPhone')} />
      </fieldset>
      <fieldset className="flex flex-col gap-2 mb-8">
        <legend className='scroll-m-20 text-xl font-semibold'>Endereço</legend>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
          <Controller
            control={control}
            name="address.uf"
            render={({ field: { onChange, value } }) => (
              <SelectWrapper label='UF' error={errors.address?.uf?.message}>
                <Select onValueChange={onChange} value={value} defaultValue={value}>
                  <SelectTrigger className="w-full" id="federation" name='federation'>
                    <SelectValue placeholder="UF" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.keys(staticBrazilianStates).map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </SelectWrapper>
            )}
          />
          <Input
            label="Cidade"
            divClassName="md:col-span-2 max-w-none"
            error={errors.address?.city?.message}
            {...register('address.city')}
          />
          <Input
            label="Local das atividades"
            divClassName="md:col-span-3 max-w-none"
            error={errors.address?.complement?.message}
            {...register('address.complement')}
          />
        </div>
      </fieldset>
      <div className="flex justify-end mt-4">
        <Button type="submit" isLoading={isExecuting}>{isEditing ? 'Editar' : 'Criar'} projeto</Button>
      </div>
    </form>
  );
}
