'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import parcours from '../data/parcours.json';
import Image from 'next/image';

interface Parcours {
    nom: string;
    ville: string;
    niveau: string;
    description: string;
    distance: string;
    dureeMarche: string;
    dureeCourse: string;
    imageUrl: string;
    type: string;
}

export default function ParcoursDebutants() {
    const [parcoursDebutants, setParcoursDebutants] = useState<Record<string, Parcours>>({});

    const getRandomNumber = () => {
        return Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
    };

    useEffect(() => {
        const debutants = Object.entries(parcours)
            .filter(([, data]) => data.niveau === 'débutant')
            .reduce((acc, [key, data]) => {
                acc[key] = data;
                return acc;
            }, {} as Record<string, Parcours>);

        setParcoursDebutants(debutants);
    }, []);

    const getNiveauStyle = (niveau: string) => {
        switch (niveau) {
            case 'débutant':
                return 'bg-[#ADFE04] text-[#131316]';
            case 'intermédiaire':
                return 'bg-yellow-100 text-[#131316]';
            case 'expert':
                return 'bg-red-100 text-[#131316]';
            default:
                return 'bg-gray-100 text-[#131316]';
        }
    };

    return (
        <div className="w-full py-2 px-2">
            <div className="flex overflow-x-auto space-x-4 pb-4">
                {Object.entries(parcoursDebutants).map(([key, parcours]) => (
                    <Link
                        href={`/parcours/${key}`}
                        key={key}
                        className="flex-shrink-0 w-80"
                    >
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            {/* Image en haut de la carte */}
                            <div className="relative h-48 w-full">
                                <Image
                                    width={630}
                                    height={405}
                                    src={parcours.imageUrl}
                                    alt="Coureur"
                                    className="w-full h-full object-cover"
                                />
                                {/* Bouton favori */}
                                <button className="absolute top-2 right-2 p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Contenu de la carte */}
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{parcours.nom}</h3>

                                {/* Badge niveau et type */}
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`${getNiveauStyle(parcours.niveau)} text-xs font-bold px-2.5 py-1`}>
                                        {parcours.niveau}
                                    </span>
                                    {/* Distance et durée */}
                                    <div className="flex items-center text-gray-700">
                                        <span className="font-bold">{parcours.distance}</span>
                                        <span className="mx-1">•</span>
                                        <span>({parcours.type === "marche à pieds" ? parcours.dureeMarche : parcours.dureeCourse})</span>
                                    </div>
                                </div>


                                <span className="text-sm text-[#131316]">
                                    {parcours.type} - {parcours.ville}
                                </span>

                                {/* Nombre de personnes */}
                                <div className="mt-2 text-sm text-gray-600">
                                    {getRandomNumber()} personnes ont déjà fait ce parcours
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
} 