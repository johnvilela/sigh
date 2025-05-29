'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAction } from 'next-safe-action/hooks';
import { CreateSessionAction } from '@/lib/modules/session/session-actions';
import { CreateSessionSchema } from '@/lib/modules/session/session-types';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof CreateSessionSchema>>({
    resolver: zodResolver(CreateSessionSchema),
  });
  const { execute, isExecuting, result } = useAction(CreateSessionAction);

  return (
    <form className="flex flex-col gap-2 my-2" onSubmit={handleSubmit(execute)}>
      {result.data?.status === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{result.data.message}</AlertDescription>
        </Alert>
      )}
      <Input type="email" label="Email" error={errors.email?.message} {...register('email')} />
      <Input type="password" label="Senha" error={errors.password?.message} {...register('password')} />
      <Button type="submit" isLoading={isExecuting}>
        Entrar
      </Button>
    </form>
  );
}
