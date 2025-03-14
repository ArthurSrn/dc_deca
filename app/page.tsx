'use client';

import { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat max-w-lg mx-auto flex items-center justify-center"
      style={{ backgroundImage: "url('/background.png')" }}>
      {isLoading ? null : (
        <AuthForm defaultView="login" />
      )}
    </div>
  );
}