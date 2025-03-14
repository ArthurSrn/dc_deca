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
    dureeEstimee: string;
    type: string;
    dureeMarche?: string;
    dureeCourse?: string;
    origine: {
        lat: number;
        lng: number;
        nom: string;
    };
    imageUrl: string;
}

interface Position {
    lat: number;
    lng: number;
}

export default function ParcoursProximite() {
    const [parcoursProches, setParcoursProches] = useState<Record<string, Parcours>>({});
    const [randomParticipants] = useState<number>(() => Math.floor(Math.random() * (500 - 100 + 1)) + 100);
    const mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const [randomMois] = useState<string>(() => mois[Math.floor(Math.random() * mois.length)]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [locationPermissionDenied, setLocationPermissionDenied] = useState<boolean>(false);

    // Calculer la distance entre deux points géographiques (formule de Haversine)
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371; // Rayon de la Terre en km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // Trouver la ville la plus proche
    const findNearestCity = (position: Position): string => {
        let nearestCity = "";
        let minDistance = Number.MAX_VALUE;

        Object.entries(parcours).forEach(([, parcoursItem]) => {
            const distance = calculateDistance(
                position.lat,
                position.lng,
                parcoursItem.origine.lat,
                parcoursItem.origine.lng
            );

            if (distance < minDistance) {
                minDistance = distance;
                nearestCity = parcoursItem.ville;
            }
        });

        return nearestCity;
    };

    // Filtrer les parcours par ville
    const filterParcoursByCity = (city: string) => {
        const filtered = Object.entries(parcours)
            .filter(([, data]) => data.ville === city)
            .reduce((acc, [key, data]) => {
                acc[key] = data;
                return acc;
            }, {} as Record<string, Parcours>);

        setParcoursProches(filtered);
    };

    // Demander la localisation de l'utilisateur
    const requestLocation = () => {
        setLoading(true);
        setError(null);
        setLocationPermissionDenied(false);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    const city = findNearestCity(pos);

                    filterParcoursByCity(city);
                    setLoading(false);
                },
                (error) => {
                    console.error("Erreur de géolocalisation:", error.message);
                    setError("Impossible d'accéder à votre position. Veuillez vérifier vos paramètres de localisation.");
                    setLoading(false);
                    setLocationPermissionDenied(true);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
            );
        } else {
            setError("La géolocalisation n'est pas supportée par votre navigateur.");
            setLoading(false);
            setLocationPermissionDenied(true);
        }
    };

    // Obtenir la localisation de l'utilisateur dès le chargement du composant
    useEffect(() => {
        requestLocation();
    }, []);

    // Si l'utilisateur a refusé la localisation ou s'il y a une erreur
    if (locationPermissionDenied || error) {
        return (
            <div className="w-full py-2 px-4">
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex flex-col items-center text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#3643BA] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>

                        <h3 className="text-lg font-semibold text-[#3643BA] mb-2">Découvrez les parcours près de chez vous</h3>
                        <p className="text-gray-600 mb-4">
                            Activez la localisation pour voir les parcours disponibles dans votre ville.
                        </p>
                        <button
                            onClick={requestLocation}
                            className="px-6 py-3 bg-[#3643BA] text-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Activer ma localisation
                        </button>
                        <p className="text-sm text-gray-500 mt-2">
                            Si vous avez refusé la localisation, veuillez l&apos;activer dans les paramètres de votre navigateur.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="w-full py-4 px-2">
                <div className="flex items-center justify-center p-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3643BA]"></div>
                    <span className="ml-2 text-[#3643BA]">Recherche de parcours près de chez vous...</span>
                </div>
            </div>
        );
    }

    if (Object.keys(parcoursProches).length === 0) {
        return (
            <div className="w-full py-4 px-2">
                <div className="bg-white rounded-lg shadow-md p-4 text-center">
                    <p className="text-gray-600">Aucun parcours trouvé près de chez vous.</p>
                    <Link href="/allparcours" className="mt-3 inline-block px-4 py-2 bg-[#3643BA] text-white rounded-md">
                        Voir tous les parcours
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full py-2 px-2">
            {loading ? (
                <div className="text-center py-4">
                    <p>Recherche des parcours à proximité...</p>
                </div>
            ) : error ? (
                <div className="text-center py-4">
                    <p>{error}</p>
                    {error.includes("denied") && (
                        <button
                            onClick={requestLocation}
                            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Activer ma localisation
                        </button>
                    )}
                </div>
            ) : (
                <div className="flex overflow-x-auto space-x-4 pb-4">
                    {Object.entries(parcoursProches).length > 0 ? (
                        Object.entries(parcoursProches).map(([key, parcours]) => (
                            <Link
                                href={`/parcours/${key}`}
                                key={key}
                                className="flex-shrink-0"
                            >
                                <div className="bg-white rounded-lg shadow-md overflow-hidden w-80">
                                    <div className="p-4">
                                        <div className="mb-2 text-sm text-gray-600">
                                            Plus de {randomParticipants} personnes se sont déjà inscrites
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <Image
                                                width={630}
                                                height={405}
                                                src={parcours.imageUrl}
                                                alt="Parcours"
                                                className="w-20 h-20 object-cover rounded-md"
                                            />

                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {randomMois} · {parcours.distance} x {parcours.ville}
                                                </h3>
                                                <p className="text-sm text-gray-700 mt-1">
                                                    Pars pour {parcours.distance} et finis par une visite de {parcours.ville}
                                                </p>

                                                <div className="mt-2">
                                                    <span className="bg-[#ADFE04] text-[#131316] text-xs font-bold px-3 py-1 rounded">
                                                        Challenge
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button className="w-full mt-4 bg-[#3643BA] hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg">
                                            Participer au challenge
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-4 w-full">
                            <p>Aucun parcours trouvé à proximité.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 