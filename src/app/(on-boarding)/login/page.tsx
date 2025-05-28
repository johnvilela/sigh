import { LoginForm } from '@/components/forms/login-form';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import Link from 'next/link';

export default function LoginPage () {
  return (
    <div>
      <Text className="text-center">Faça o login no SIGH ou registre-se</Text>

      <LoginForm />

      <Button variant="outline" className="w-full" aria-label="Ainda não tem cadastro? Clique aqui" asChild>
        <Link className="p-2 font-medium text-light-on-surface text-center block" href="/cadastro">
          Ainda não tem cadastro?
        </Link>
      </Button>

      <Button variant="link" className="w-full" asChild>
        <Link
          aria-label="Esqueceu a senha? Clique aqui"
          className="p-2 font-medium text-light-on-surface text-center block"
          href="/esqueceu-a-senha"
        >
          Esqueceu a senha?
        </Link>
      </Button>
    </div>
  );
}
