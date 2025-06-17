'use client';

import { Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../alert-dialog";
import { Button } from "../../button";
import { useDataListContext } from "@/contexts/data-list-context";

interface DeleteAlertProps {
  title?: string;
  description?: string;
  id: string;
}

export function DeleteAction ({ title, description, id }: DeleteAlertProps) {
  const { deleteItem } = useDataListContext()

  return (
    <AlertDialog>
      <AlertDialogTrigger
        asChild
      >
        <Button
          size="icon"
          variant="ghost"
          className="text-destructive hover:text-red-800"
        >
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || 'Desejar apagar?'}</AlertDialogTitle>
          <AlertDialogDescription>
            {description || 'Essa ação não poderá ser desfeita.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant='destructive'
            onClick={() => deleteItem(id)}
          >
            Apagar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog >
  )
}