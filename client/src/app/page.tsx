'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  // Redirect to '/dashboard' when the component mounts
  useEffect(() => {
    router.push('/dashboard');
  }, []);

  return <main></main>;
}