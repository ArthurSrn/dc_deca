'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface FormOption {
    id: string;
    label: string;
}

// Options pour chaque étape
const ageOptions: FormOption[] = [
    { id: 'less-than-20', label: 'Moins de 20 ans' },
    { id: '20-25', label: '20 - 25' },
    { id: '26-35', label: '26 - 35' },
    { id: '35-50', label: '35 - 50' },
    { id: 'more-than-50', label: 'Plus de 50 ans' },
];

const levelOptions: FormOption[] = [
    { id: 'beginner', label: 'Débutant' },
    { id: 'part-time', label: 'Sportif à temps partiel' },
    { id: 'intermediate', label: 'Intermédiaire' },
    { id: 'advanced', label: 'Grand sportif' },
];

const goalOptions: FormOption[] = [
    { id: 'start-walking', label: 'Commencer la marche' },
    { id: 'start-running', label: 'Commencer la course' },
    { id: 'stay-motivated', label: 'Rester motivé(e)' },
    { id: 'discover-city', label: 'Découvrir ma ville' },
    { id: 'see-nature', label: 'Voir la nature' },
    { id: 'other-goal', label: 'Autre' },
];

const interestOptions: FormOption[] = [
    { id: 'nature', label: 'Nature' },
    { id: 'museums', label: 'Musées' },
    { id: 'discover-places', label: 'Découvrir des lieux' },
    { id: 'parks', label: 'Parcs' },
    { id: 'forest', label: 'Forêt' },
    { id: 'other-interest', label: 'Autre' },
];

// Composants pour les titres
const StepTitle1 = () => (
    <h1 className="text-[#131316] text-[20px] font-semibold leading-[32px] tracking-[0.2px] uppercase mb-6">
        QUEL ÂGE AS-TU ?
    </h1>
);

const StepTitle2 = () => (
    <h1 className="text-[#131316] text-[20px] font-semibold leading-[32px] tracking-[0.2px] uppercase mb-6">
        QUEL EST TON NIVEAU ?
    </h1>
);

const StepTitle3 = () => (
    <h1 className="text-[#131316] text-[20px] font-semibold leading-[32px] tracking-[0.2px] uppercase mb-6">
        QUE RECHERCHES-TU ICI ? (Plusieurs choix possibles)
    </h1>
);

const StepTitle4 = () => (
    <h1 className="text-[#131316] text-[20px] font-semibold leading-[32px] tracking-[0.2px] uppercase mb-6">
        {"QU'AIMES-TU ?"}
    </h1>
);

interface MultiStepFormProps {
    onComplete: () => void;
}

export default function MultiStepForm({ onComplete }: MultiStepFormProps) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    // État pour chaque étape
    const [selectedAge, setSelectedAge] = useState<string | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    // Gestion des sélections pour les étapes à choix unique
    const handleSingleSelect = (optionId: string) => {
        switch (currentStep) {
            case 1:
                setSelectedAge(optionId);
                break;
            case 2:
                setSelectedLevel(optionId);
                break;
            default:
                break;
        }
    };

    // Gestion des sélections pour les étapes à choix multiples
    const handleMultiSelect = (optionId: string) => {
        switch (currentStep) {
            case 3:
                setSelectedGoals(prev =>
                    prev.includes(optionId)
                        ? prev.filter(id => id !== optionId)
                        : [...prev, optionId]
                );
                break;
            case 4:
                setSelectedInterests(prev =>
                    prev.includes(optionId)
                        ? prev.filter(id => id !== optionId)
                        : [...prev, optionId]
                );
                break;
            default:
                break;
        }
    };

    // Vérifier si le bouton continuer doit être activé
    const isContinueEnabled = () => {
        switch (currentStep) {
            case 1:
                return selectedAge !== null;
            case 2:
                return selectedLevel !== null;
            case 3:
                return selectedGoals.length > 0;
            case 4:
                return selectedInterests.length > 0;
            default:
                return false;
        }
    };

    // Passer à l'étape suivante
    const handleContinue = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        } else {
            // Soumettre le formulaire ou afficher un résumé
            console.log('Formulaire complété!', {
                age: selectedAge,
                level: selectedLevel,
                goals: selectedGoals,
                interests: selectedInterests
            });
            onComplete();
            // Utilisez router.push pour la navigation
            router.push('/parti'); // ou toute autre route de destination
        }
    };

    // Obtenir les options pour l'étape actuelle
    const getCurrentOptions = () => {
        switch (currentStep) {
            case 1:
                return ageOptions;
            case 2:
                return levelOptions;
            case 3:
                return goalOptions;
            case 4:
                return interestOptions;
            default:
                return [];
        }
    };

    // Vérifier si une option est sélectionnée
    const isOptionSelected = (optionId: string) => {
        switch (currentStep) {
            case 1:
                return selectedAge === optionId;
            case 2:
                return selectedLevel === optionId;
            case 3:
                return selectedGoals.includes(optionId);
            case 4:
                return selectedInterests.includes(optionId);
            default:
                return false;
        }
    };

    // Gérer la sélection d'une option
    const handleOptionSelect = (optionId: string) => {
        if (currentStep <= 2) {
            handleSingleSelect(optionId);
        } else {
            handleMultiSelect(optionId);
        }
    };

    // Rendre le titre en fonction de l'étape
    const renderStepTitle = () => {
        switch (currentStep) {
            case 1:
                return <StepTitle1 />;
            case 2:
                return <StepTitle2 />;
            case 3:
                return <StepTitle3 />;
            case 4:
                return <StepTitle4 />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white max-w-md mx-auto shadow-lg">
            <div className="flex-1 p-6 flex flex-col">
                {renderStepTitle()}

                <div className="space-y-3 mb-auto">
                    {getCurrentOptions().map((option) => (
                        <div
                            key={option.id}
                            className={`flex h-[55px] px-4 justify-between items-center self-stretch cursor-pointer transition-colors rounded-lg border ${isOptionSelected(option.id)
                                ? 'border-[#3643BA] bg-white'
                                : 'border-gray-300 hover:border-[#3643BA] hover:bg-white'
                                }`}
                            onClick={() => handleOptionSelect(option.id)}
                        >
                            <span className="flex-  1 text-sm text-[#131316]">{option.label}</span>
                            <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${isOptionSelected(option.id)
                                    ? 'border-[#3643BA] bg-[#3643BA]'
                                    : 'border-gray-300'
                                    }`}
                            >
                                {isOptionSelected(option.id) && (
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-6">
                <button
                    className={`w-full py-3 rounded-lg text-white font-medium ${isContinueEnabled()
                        ? 'bg-[#3643BA]'
                        : 'bg-[#CCCDD7]'
                        }`}
                    onClick={handleContinue}
                    disabled={!isContinueEnabled()}
                >
                    CONTINUER
                </button>

                <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: totalSteps }).map((_, index) => (
                        index + 1 === currentStep ? (
                            <div
                                key={index}
                                className="w-[24px] h-[12px] rounded-[10px] bg-[#131316]"
                            />
                        ) : (
                            <svg
                                key={index}
                                xmlns="http://www.w3.org/2000/svg"
                                width="13"
                                height="13"
                                viewBox="0 0 13 13"
                                fill="none"
                                className="w-[12px] h-[12px]"
                            >
                                <circle cx="6.58789" cy="6.49048" r="6" fill="#CCCDD7" />
                            </svg>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
} 