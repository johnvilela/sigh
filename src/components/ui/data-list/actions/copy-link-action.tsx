'use client';

import { CircleAlert, Copy } from "lucide-react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../alert-dialog";
import { Button } from "../../button";
import { Text } from "../../text";
import { fetcher } from "@/lib/services/swr";
import useSWR from 'swr'

interface WarningAlertProps {
  id: string
}

export function CopyLinkAction ({ id }: WarningAlertProps) {
  const { data, error, isLoading } = useSWR(`/api/token/${id}`, fetcher)

  const url = data ? `${process.env.NEXT_PUBLIC_DEFAULT_URL}/trocar-senha/${data.token}` : '';

  function handleCopyLink () {
    navigator.clipboard.writeText(url);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        asChild
      >
        <Button size="icon" variant="ghost" className='text-yellow-600'>
          <CircleAlert />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Usuário precisa criar senha</AlertDialogTitle>
          <AlertDialogDescription>
            {isLoading && <Text>Gerando link para o usuário...</Text>}
            {error && <Text className='text-red-600'>Erro ao gerar link: {error.message}</Text>}
            {(data && !isLoading) &&
              (
                <>
                  <Text className='mb-2'>O usuário ainda não criou uma senha. Você pode copiar o link para enviar ao usuário.</Text>
                  <div className='flex items-center gap-2'>
                  <Text variant='code' className='flex-1 break-all line-clamp-1'>{url}</Text>
                  <Button variant='ghost' size='icon' onClick={handleCopyLink}>
                    <Copy />
                  </Button>
                </div>
                </>
              )
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Ok</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}