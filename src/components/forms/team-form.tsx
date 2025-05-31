'use client';

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileInput } from "../ui/file-input";
import { AlertCircle, File, Image } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useRouter } from "next/navigation";
import { useFileHandler } from "@/hooks/use-file-handler";
import { useEffect } from "react";
import { GenericStatus } from "@/lib/shared/enums/generic-status";
import { Federation, Team } from "@/generated/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectWrapper } from "../ui/select";
import { MutateTeamFormSchema } from "@/lib/modules/team/team-types";
import { mutatetTeamAction } from "@/lib/modules/team/team-actions";

dayjs.extend(utc)

const TeamFormSchema = MutateTeamFormSchema.omit({
  logo: true,
  presidentDocument: true,
  teamDocument: true,
  electionMinutes: true,
})

interface TeamFormProps {
  team?: Team;
  federations?: Pick<Federation, 'id' | 'name' | 'initials'>[];
  isEditing?: boolean;
}

export function TeamForm ({ team, federations, isEditing }: TeamFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<z.infer<typeof TeamFormSchema>>({
    resolver: zodResolver(TeamFormSchema),
    defaultValues: {
      name: team?.name || '',
      initials: team?.initials || '',
      url: team?.url || '',
      email: team?.email || '',
      presidentName: team?.presidentName || '',
      coachName: team?.coachName || '',
      federationId: team?.federationId || '',
      description: team?.description || '',
      beginningOfTerm: dayjs.utc(team?.beginningOfTerm).format('YYYY-MM-DD') || undefined,
      endOfTerm: dayjs.utc(team?.endOfTerm).format('YYYY-MM-DD') || undefined,
    },
  });

  console.log(errors)

  const { registerInput, generalStatus, uploadFiles } = useFileHandler({
    logo: 'newsigh/team/',
    presidentDocument: 'newsigh/team/',
    teamDocument: 'newsigh/team/',
    electionMinutes: 'newsigh/team/',
  });
  const { isExecuting, result, execute } = useAction(mutatetTeamAction)
  const { push } = useRouter()

  useEffect(() => {
    if (result.data?.status === 'success') push('/clubes')
  }, [push, result.data?.status])

  const isSubmitting = isExecuting || generalStatus === GenericStatus.EXECUTING;

  return (
    <form
      className="max-w-3xl mx-auto"
      onSubmit={handleSubmit(async (data) => {
        const files = await uploadFiles();

        await execute({
          ...data,
          id: team?.id || undefined,
          electionMinutes: files.electionMinutes || undefined,
          teamDocument: files.teamDocument || undefined,
          presidentDocument: files.presidentDocument || undefined,
          logo: files.logo || undefined,
        })
      })}
    >
      {result.data?.status === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{'Erro ao criar clube!'}</AlertDescription>
        </Alert>
      )}
      <fieldset className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8">
        <div className="md:col-span-4">
          <legend className=" scroll-m-20 text-xl font-semibold">Dados do Clube</legend>
        </div>
        <div className="md:col-span-1 h-24 md:h-full">
          <FileInput
            hook={registerInput('logo')}
            label='Logo'
            divClassName="col-span-1 h-10 h-full"
            labelClassName="h-full"
            icon={Image}
            spanMsg="Clique ou arraste para anexar o LOGO do clube"
            fileUrl={team?.logo || ''}
          />
        </div>
        <div className="col-span-1 md:col-span-3 grid gap-2 grid-cols-1 md:grid-cols-4">
          <Input
            label="Nome"
            divClassName="md:col-span-3 max-w-none"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Sigla"
            divClassName="md:col-span-1 max-w-none"
            error={errors.initials?.message}
            {...register('initials')}
          />
          <Input label="Site" divClassName="md:col-span-2 max-w-none" error={errors.url?.message} {...register('url')} />
          <Input
            type="email"
            divClassName="md:col-span-2 max-w-none"
            label="Email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            divClassName="md:col-span-2 max-w-none"
            label="Nome do Técnico"
            error={errors.coachName?.message}
            {...register('coachName')}
          />
          <Controller
            control={control}
            name="federationId"
            render={({ field: { onChange, value } }) => (
              <SelectWrapper name='federation' className="md:col-span-2 max-w-none" label="Federação">
                <Select onValueChange={onChange} value={value} defaultValue={value}>
                  <SelectTrigger className="w-full" id="federation" name='federation'>
                    <SelectValue placeholder="Escolha uma federação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {
                        federations?.length === 0 ? (
                          <SelectItem value="" disabled>
                            Nenhuma federação cadastrada
                          </SelectItem>
                        ) : federations?.map(federation => (
                          <SelectItem key={federation.id} value={federation.id}>
                            {federation.initials} - {federation.name}
                          </SelectItem>
                        ))
                      }
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </SelectWrapper>
            )}
          />
        </div>
        <div className="md:col-span-4">
          <Textarea
            label="Descrição"
            divClassName="max-w-none"
            error={errors.description?.message}
            {...register('description')}
          />
        </div>
      </fieldset>
      <fieldset className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8">
        <legend className="scroll-m-20 text-xl font-semibold">Dados do presidente</legend>
        <Input
          divClassName="md:col-span-4 max-w-none"
          label="Nome do presidente"
          error={errors.presidentName?.message}
          {...register('presidentName')}
        />
        <Input
          type="date"
          divClassName="md:col-span-2 max-w-none"
          label="Data do início do mandato"
          error={errors.beginningOfTerm?.message}
          {...register('beginningOfTerm')}
        />
        <Input
          type="date"
          divClassName="md:col-span-2 max-w-none"
          label="Data do fim do mandato"
          error={errors.endOfTerm?.message}
          {...register('endOfTerm')}
        />
      </fieldset>
      <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <legend className="scroll-m-20 text-xl font-semibold">Documentos</legend>
        <FileInput
          hook={registerInput('teamDocument')}
          divClassName="col-span-1"
          icon={File}
          label="Estatuto da Entidade"
          fileUrl={team?.teamDocument || ''}
          showLabel />
        <FileInput
          hook={registerInput('presidentDocument')}
          divClassName="col-span-1"
          icon={File}
          label="RG do Presidente"
          fileUrl={team?.presidentDocument || ''}
          showLabel />
        <FileInput
          hook={registerInput('electionMinutes')}
          divClassName="col-span-1"
          icon={File}
          label="Ata da eleição"
          fileUrl={team?.electionMinutes || ''}
          showLabel />
      </fieldset>
      <div className="flex justify-end mt-4">
        <Button type="submit" isLoading={isSubmitting}>{isEditing ? 'Editar' : 'Criar'} clube</Button>
      </div>
    </form>
  );
}
