import { CircleAlert, Copy } from "lucide-react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../alert-dialog";
import { Button } from "../../button";
import { Text } from "../../text";

interface WarningAlertProps {
  title: string;
  description: string;
  link: string;
}

export function CopyLinkAction ({ title, description, link }: WarningAlertProps) {
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
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
            <div className='flex items-center gap-2'>
              <Text variant='code' className='flex-1'>{link}</Text>
              <Button variant='ghost' size='icon' onClick={() => {
                navigator.clipboard.writeText(link);
              }}>
                <Copy />
              </Button>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Ok</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}