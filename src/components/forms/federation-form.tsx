'use client';

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { mutateFederationAction } from "@/lib/modules/federation/federation-actions";
import { MutateFederationFormSchema } from "@/lib/modules/federation/federation-types";
import { FileInput } from "../ui/file-input";
import { AlertCircle, File, Image } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useRouter } from "next/navigation";
import { useFileHandler } from "@/hooks/use-file-handler";
import { useEffect } from "react";
import { GenericStatus } from "@/lib/shared/enums/generic-status";
import { Federation } from "@/generated/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc)

const FederationFormSchema = MutateFederationFormSchema.omit({
  logo: true,
  presidentDocument: true,
  federationDocument: true,
  electionMinutes: true,
})

interface FederationFormProps {
  federation?: Federation;
  isEditing?: boolean;
}

export function FederationForm ({ federation, isEditing }: FederationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof FederationFormSchema>>({
    resolver: zodResolver(FederationFormSchema),
    defaultValues: {
      name: federation?.name || '',
      initials: federation?.initials || '',
      uf: federation?.uf || '',
      email: federation?.email || '',
      presidentName: federation?.presidentName || '',
      beginningOfTerm: dayjs.utc(federation?.beginningOfTerm).format('YYYY-MM-DD') || undefined,
      endOfTerm: dayjs.utc(federation?.endOfTerm).format('YYYY-MM-DD') || undefined,
    },
  });
  const { uploadFiles, registerInput, generalStatus } = useFileHandler({
    logo: 'newsigh/federation/',
    presidentDocument: 'newsigh/federation/',
    federationDocument: 'newsigh/federation/',
    electionMinutes: 'newsigh/federation/',
  });
  const { execute, isExecuting, result } = useAction(mutateFederationAction)
  const { push } = useRouter()

  useEffect(() => {
    if (result.data?.status === 'success') push('/federacoes')
  }, [push, result.data?.status])

  const isSubmitting = isExecuting || generalStatus === GenericStatus.EXECUTING;

  return (
    <form
      className="max-w-3xl mx-auto"
      onSubmit={handleSubmit(async (data) => {
        const files = await uploadFiles();

        await execute({
          ...data,
          id: federation?.id || undefined,
          electionMinutes: files.electionMinutes || undefined,
          federationDocument: files.federationDocument || undefined,
          presidentDocument: files.presidentDocument || undefined,
          logo: files.logo || undefined,
        })
      })}
    >
      {result.data?.status === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{'Erro ao criar Federação!'}</AlertDescription>
        </Alert>
      )}
      <fieldset className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8">
        <div className="md:col-span-4">
          <legend className=" scroll-m-20 text-xl font-semibold">Dados da Federação</legend>
        </div>
        <div className="md:col-span-1 h-24 md:h-full">
          <FileInput
            hook={registerInput('logo')}
            label='Logo'
            divClassName="col-span-1 h-10 h-full"
            labelClassName="h-full"
            icon={Image}
            spanMsg="Clique ou arraste para anexar o LOGO da federação"
            fileUrl={federation?.logo || ''}
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
          <Input label="UF" divClassName="md:col-span-1 max-w-none" error={errors.email?.message} {...register('uf')} />
          <Input
            type="email"
            divClassName="md:col-span-3 max-w-none"
            label="Email"
            error={errors.email?.message}
            {...register('email')}
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
          hook={registerInput('federationDocument')}
          divClassName="col-span-1"
          icon={File}
          label="Documento da federação"
          fileUrl={federation?.federationDocument || ''}
          showLabel />
        <FileInput
          hook={registerInput('presidentDocument')}
          divClassName="col-span-1"
          icon={File}
          label="Documento do presidente"
          fileUrl={federation?.presidentDocument || ''}
          showLabel />
        <FileInput
          hook={registerInput('electionMinutes')}
          divClassName="col-span-1"
          icon={File}
          label="Ata da eleição"
          fileUrl={federation?.electionMinutes || ''}
          showLabel />
      </fieldset>
      <div className="flex justify-end mt-4">
        <Button type="submit" isLoading={isSubmitting}>{isEditing ? 'Editar' : 'Criar'} federação</Button>
      </div>
    </form>
  );
}
