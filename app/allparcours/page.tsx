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

export default function AllParcours() {
    const [parcoursDebutants, setParcoursDebutants] = useState<Record<string, Parcours>>({});
    const [parcours5km, setParcours5km] = useState<Record<string, Parcours>>({});
    const [parcours10km, setParcours10km] = useState<Record<string, Parcours>>({});
    const [parcoursStats, setParcoursStats] = useState<Record<string, number>>({});

    useEffect(() => {
        // Générer des nombres aléatoires pour chaque parcours une seule fois
        const stats: Record<string, number> = {};
        Object.keys(parcours).forEach(key => {
            stats[key] = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
        });
        setParcoursStats(stats);

        // Filtrer les parcours débutants
        const debutants = Object.entries(parcours)
            .filter(([, data]) => data.niveau === 'débutant')
            .reduce((acc, [key, data]) => {
                acc[key] = data;
                return acc;
            }, {} as Record<string, Parcours>);

        // Filtrer les parcours d'environ 5km
        const cinqKm = Object.entries(parcours)
            .filter(([, data]) => {
                const distanceNum = parseFloat(data.distance.replace('km', '').trim());
                return distanceNum >= 4 && distanceNum <= 6;
            })
            .reduce((acc, [key, data]) => {
                acc[key] = data;
                return acc;
            }, {} as Record<string, Parcours>);

        // Filtrer les parcours d'environ 10km
        const dixKm = Object.entries(parcours)
            .filter(([, data]) => {
                const distanceNum = parseFloat(data.distance.replace('km', '').trim());
                return distanceNum >= 9 && distanceNum <= 11;
            })
            .reduce((acc, [key, data]) => {
                acc[key] = data;
                return acc;
            }, {} as Record<string, Parcours>);

        setParcoursDebutants(debutants);
        setParcours5km(cinqKm);
        setParcours10km(dixKm);
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

    const renderParcoursSection = (title: string, parcoursData: Record<string, Parcours>) => (
        <div className="mb-8">
            <h2 className="text-xl text-[#3643BA] font-bold tracking-[1px] px-4 mb-2">
                {title}
            </h2>
            <div className="flex overflow-x-auto space-x-4 pb-4 px-2">
                {Object.entries(parcoursData).map(([key, parcours]) => {
                    return (
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

                                    {/* Utiliser le nombre stocké dans parcoursStats */}
                                    <div className="mt-2 text-sm text-gray-600">
                                        {parcoursStats[key]} personnes ont déjà fait ce parcours
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="relative w-full max-w-lg mx-auto bg-white flex flex-col">
            <nav className="w-full bg-[#3643BA] text-white p-4 flex justify-between items-center shadow">
                <Link href="/home">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </Link>
                <div className="flex items-center">
                    <h1 className="text-lg font-normal">TOUS LES PARCOURS</h1>
                </div>
                <div className="w-6"></div> {/* Espace vide pour équilibrer */}
            </nav>

            <section className="py-6">
                {renderParcoursSection("PARCOURS DÉCOUVERTE", parcoursDebutants)}
                {renderParcoursSection("NOS 5KM", parcours5km)}
                {renderParcoursSection("NOS 10KM", parcours10km)}
            </section>
        </div>
    );
}
