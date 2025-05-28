'use client';

import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function RegisterForm () {
  const {
    register,
    handleSubmit,
  } = useForm();

  return (
    <form className="flex flex-col gap-2 my-2" onSubmit={handleSubmit(data => console.log(data))}>
      <Input label="Name" {...register('name')} />
      <Input type="email" label="Email" {...register('email')} />
      <Input label="CPF" {...register('document')} />
      <Input type="date" label="Data de nascimento" {...register('birthDate')} />
      <Input type="password" label="Senha" {...register('password')} />
      <Button type="submit">
        Criar conta
      </Button>
    </form>
  );
}
