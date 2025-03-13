'use client';

import { useState, useCallback } from 'react';
import LoadingBar from './components/LoadingBar';
import AuthForm from './components/AuthForm';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat max-w-lg mx-auto flex items-center justify-center"
      style={{ backgroundImage: "url('/background.png')" }}>
      {isLoading ? (
        <LoadingBar onLoadingComplete={handleLoadingComplete} duration={1500} />
      ) : (
        <AuthForm defaultView="login" />
      )}
    </div>
  );
}