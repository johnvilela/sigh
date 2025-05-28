'use client';

import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function LoginForm () {
  const {
    register,
    handleSubmit,
  } = useForm();

  return (
    <form className="flex flex-col gap-2 my-2" onSubmit={handleSubmit(data => console.log(data))}>
      <Input type="email" label="Email" {...register('email')} />
      <Input type="password" label="Senha" {...register('password')} />
      <Button type="submit">
        Entrar
      </Button>
    </form>
  );
}
