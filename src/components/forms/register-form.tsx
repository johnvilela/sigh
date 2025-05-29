'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAction } from 'next-safe-action/hooks';
import { CreateUserAction } from '@/lib/modules/user/user-actions';
import { CreateUserSchema } from '@/lib/modules/user/user-types';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
  });
  const { execute, isExecuting, result } = useAction(CreateUserAction);

  return (
    <form className="flex flex-col gap-2 my-2" onSubmit={handleSubmit(execute)}>
      {result.data?.status === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{result.data.message}</AlertDescription>
        </Alert>
      )}
      <Input label="Name" error={errors.name?.message} {...register('name')} />
      <Input type="email" label="Email" error={errors.email?.message} {...register('email')} />
      <Input label="CPF" error={errors.document?.message} {...register('document')} />
      <Input type="date" label="Data de nascimento" error={errors.birthDate?.message} {...register('birthDate')} />
      <Input type="password" label="Senha" error={errors.password?.message} {...register('password')} />
      <Button type="submit" isLoading={isExecuting}>
        Criar conta
      </Button>
    </form>
  );
}
