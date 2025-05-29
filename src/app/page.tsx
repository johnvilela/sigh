'use client';

import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage () {
  useEffect(() => {
    setTimeout(() => {
      redirect('/login');
    }, 2000);
  });

  return (
    <main className="grid place-items-center h-screen">
      <div className="max-w-md flex flex-col items-center">
        <Image src="/cbhg-logo.png" width={224} height={124} alt="Logo da CBHG" />
        <Heading>SIGH</Heading>
        <Text variant="lead">Aguarde um instante para fazer login</Text>
      </div>
    </main>
  );
}
