import { Text } from '@/components/ui/text';

export default function RegisterPage() {
  return (
    <div>
      <Text className="text-center">Cadastro de atletas do hóquei brasileiro</Text>


      <Text variant="small" className="text-center text-xs font-normal opacity-60">
        {
          '* Caso ainda não tenha um clube e deseja conhecer e praticar este esporte, acesse nosso site e saiba como jogar hóquei no Brasil. Saiba mais!'
        }
      </Text>
    </div>
  );
}
