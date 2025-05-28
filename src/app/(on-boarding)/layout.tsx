import { Text } from '@/components/ui/text';
import Image from 'next/image';
import Link from 'next/link';

export default function OnBoardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-stretch h-screen overflow-hidden">
      <div className="flex flex-col justify-between w-full lg:max-w-2xl overflow-y-auto bg-light-background">
        <div className="mt-12">
          <Link href="/login">
            <Image src="/cbhg-logo.png" width={224} height={124} alt="Logo da CBHG" className="mx-auto" />
          </Link>
        </div>

        <div className="max-w-sm mx-auto w-full p-4">{children}</div>

        <div className="h-16 p-6">
          <Text className="text-center" variant="small">
            Sistema Integrado de Gerenciamento do Hóquei (SIGH)
          </Text>
        </div>
      </div>

      <div className="flex-1 relative hidden lg:block">
        <Image src="/on-boarding.jpg" alt="Campo de Hóquei sobre grama" fill />
      </div>
    </div>
  );
}
