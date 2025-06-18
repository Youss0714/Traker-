import { useEffect, useState } from 'react';
import { Logo } from './ui/logo';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Commencer l'animation de sortie après 4.5 secondes
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 4500);

    // Terminer le splash screen après 5 secondes
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center z-50 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        {/* Logo avec animation de scale et rotation */}
        <div className="mb-8 animate-bounce">
          <div className="transform transition-all duration-1000 animate-pulse scale-125">
            <Logo className="text-white w-24 h-24 mx-auto" />
          </div>
        </div>
        
        {/* Nom de l'application */}
        <div className="text-white space-y-2">
          <h1 className="text-4xl font-bold animate-fade-in-up">gYS</h1>
          <p className="text-xl text-purple-100 animate-fade-in-up animation-delay-500">
            Gestion d'Entreprise
          </p>
          <p className="text-sm text-purple-200 animate-fade-in-up animation-delay-1000">
            by Youssouf Sawadogo
          </p>
        </div>

        {/* Barre de progression animée */}
        <div className="mt-12 w-64 mx-auto">
          <div className="w-full bg-purple-800/30 rounded-full h-1">
            <div className="bg-white h-1 rounded-full animate-progress"></div>
          </div>
        </div>

        {/* Points de chargement */}
        <div className="mt-8 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse animation-delay-300"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse animation-delay-600"></div>
        </div>
      </div>
    </div>
  );
}