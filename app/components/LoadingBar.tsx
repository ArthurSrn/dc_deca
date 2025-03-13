import React, { useEffect, useState } from 'react';

interface LoadingBarProps {
    onLoadingComplete: () => void;
    duration?: number;
}

const LoadingBar: React.FC<LoadingBarProps> = ({
    onLoadingComplete,
    duration = 1500
}) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Approche linéaire simple et fiable
        const startTime = Date.now();
        let animationFrameId: number;
        let completed = false;

        const updateProgress = () => {
            if (completed) return;

            const elapsedTime = Date.now() - startTime;

            // Progression linéaire simple
            const progressPercent = Math.min(100, (elapsedTime / duration) * 100);

            setProgress(progressPercent);

            // Si on a atteint la fin de la durée, terminer à 100%
            if (elapsedTime >= duration) {
                setProgress(100);
                completed = true;
                // Appeler onLoadingComplete après un court délai
                setTimeout(() => {
                    onLoadingComplete();
                }, 50);
                return;
            }

            animationFrameId = requestAnimationFrame(updateProgress);
        };

        // Démarrer l'animation
        animationFrameId = requestAnimationFrame(updateProgress);

        // Assurer que le chargement se termine même en cas de problème
        const forceCompleteTimeout = setTimeout(() => {
            if (!completed) {
                completed = true;
                setProgress(100);
                onLoadingComplete();
            }
        }, duration + 200); // Ajouter une marge de sécurité

        return () => {
            cancelAnimationFrame(animationFrameId);
            clearTimeout(forceCompleteTimeout);
        };
    }, [duration, onLoadingComplete]);

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="w-64 md:w-96 bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-100 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};

export default LoadingBar; 