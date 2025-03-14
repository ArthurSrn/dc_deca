'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleMap, useJsApiLoader, Marker, DirectionsService, DirectionsRenderer, Libraries } from '@react-google-maps/api';
import parcoursData from '../../data/parcours.json';
import React from 'react';
import Camera from '../../components/Camera';

interface ParcoursType {
    nom: string;
    ville: string;
    niveau: string;
    description: string;
    distance: string;
    dureeEstimee: string;
    calories: number;
    vitesse: string;
    denivele: string;
    bpm: string;
    origine: {
        nom: string;
        lat: number;
        lng: number;
    };
    destination: {
        nom: string;
        lat: number;
        lng: number;
    };
    pointsIntermediaires: Array<{
        location: {
            nom: string;
            lat: number;
            lng: number;
        };
        stopover: boolean;
    }>;
}

interface Position {
    lat: number;
    lng: number;
}

const containerStyle = {
    width: '100%',
    height: '600px'
};

const libraries: Libraries = ["places"];

export default function ParcoursDetail() {
    const params = useParams();
    const router = useRouter();
    const [parcours, setParcours] = useState<ParcoursType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
    const [icon, setIcon] = useState<google.maps.Icon | null>(null);
    const [geolocationError, setGeolocationError] = useState<string | null>(null);
    const [locationPermissionRequested, setLocationPermissionRequested] = useState<boolean>(false);
    const [timeToStart, setTimeToStart] = useState<string | null>(null);
    const [distanceToStart, setDistanceToStart] = useState<string | null>(null);
    const [calculatingRoute, setCalculatingRoute] = useState<boolean>(false);
    const [showCamera, setShowCamera] = useState<boolean>(false);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: libraries
    });

    useEffect(() => {
        if (params.id) {
            const parcoursId = params.id as string;
            // @ts-expect-error - Nous savons que parcoursData contient les données
            const parcoursInfo = parcoursData[parcoursId];

            if (parcoursInfo) {
                setParcours(parcoursInfo);
            } else {
                // Rediriger vers la page d'accueil si le parcours n'existe pas
                router.push('/home');
            }

            setLoading(false);
        }
    }, [params.id, router]);

    // Fonction pour demander la localisation
    const requestLocation = () => {
        setLocationPermissionRequested(true);
        setGeolocationError(null);

        if (typeof navigator !== 'undefined' && navigator.geolocation) {
            try {
                setCalculatingRoute(true);
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        setCurrentPosition(pos);
                        setGeolocationError(null);

                        // Continuer à surveiller la position
                        const watchId = navigator.geolocation.watchPosition(
                            (updatedPosition) => {
                                setCurrentPosition({
                                    lat: updatedPosition.coords.latitude,
                                    lng: updatedPosition.coords.longitude
                                });
                            },
                            (error) => {
                                console.log('Erreur de mise à jour de la géolocalisation:', error.message);
                            },
                            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                        );

                        // Nettoyer le watchPosition lors du démontage du composant
                        return () => {
                            navigator.geolocation.clearWatch(watchId);
                        };
                    },
                    (error) => {
                        console.log('Erreur de géolocalisation:', error.message);
                        setGeolocationError(error.message || 'Impossible d\'accéder à votre position');
                        setCalculatingRoute(false);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
                );
            } catch (error) {
                console.log('Erreur lors de l\'initialisation de la géolocalisation:', error);
                setGeolocationError('Erreur lors de l\'initialisation de la géolocalisation');
                setCalculatingRoute(false);
            }
        } else {
            setGeolocationError('La géolocalisation n\'est pas supportée par ce navigateur');
            setCalculatingRoute(false);
        }
    };

    // Calculer le temps et la distance jusqu'au point de départ
    useEffect(() => {
        if (currentPosition && parcours && isLoaded && window.google) {
            const directionsService = new window.google.maps.DirectionsService();

            directionsService.route(
                {
                    origin: currentPosition,
                    destination: parcours.origine,
                    travelMode: window.google.maps.TravelMode.WALKING
                },
                (result, status) => {
                    if (status === 'OK' && result) {
                        const route = result.routes[0].legs[0];
                        setTimeToStart(route.duration?.text || null);
                        setDistanceToStart(route.distance?.text || null);
                    } else {
                        console.log('Erreur de calcul d\'itinéraire vers le point de départ:', status);
                    }
                    setCalculatingRoute(false);
                }
            );
        }
    }, [currentPosition, parcours, isLoaded]);

    const directionsOptions = useMemo(() => {
        if (!parcours) return null;

        return {
            destination: parcours.destination,
            origin: parcours.origine,
            waypoints: parcours.pointsIntermediaires,
            optimizeWaypoints: true,
            travelMode: "WALKING" as google.maps.TravelMode
        };
    }, [parcours]);

    const rendererOptions = useMemo(() => ({
        polylineOptions: {
            strokeColor: '#3643BA',
            strokeWeight: 4,
            strokeOpacity: 1.0
        }
    }), []);

    // Mémoriser la callback des directions pour éviter des re-renders intempestifs
    const directionsCallback = useCallback(
        (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
            if (status === 'OK' && result !== null) {
                setDirections(result);
            } else if (status !== 'OK') {
                console.error('Directions request failed due to ' + status);
            }
        },
        []
    );

    // Mémoriser la fonction de chargement de la carte
    const handleMapLoad = useCallback(() => {
        if (!icon && window.google) {
            setIcon({
                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                scaledSize: new window.google.maps.Size(40, 40)
            });
        }
    }, [icon]);

    // Ajoutez cette fonction pour créer des marqueurs personnalisés avec des lettres
    const createCustomMarker = useCallback((letter: string, color: string) => {
        if (!window.google) return undefined;

        return {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: color,
            fillOpacity: 1,
            scale: 12,
            strokeColor: 'white',
            strokeWeight: 2,
            labelOrigin: new window.google.maps.Point(0, 0),
            label: {
                text: letter,
                color: 'white',
                fontWeight: 'bold',
                fontSize: '12px'
            }
        };
    }, []);

    // Fonction pour obtenir la couleur en fonction de l'index du point intermédiaire
    const getPointColor = (index: number) => {
        // Premier point intermédiaire en jaune, deuxième en bleu
        return index === 0 ? '#FFC107' : '#3F51B5';
    };

    // Fonction pour ouvrir/fermer la caméra
    const toggleCamera = () => {
        setShowCamera(!showCamera);
    };

    if (loading) {
        return (
            <div className="relative h-screen w-full max-w-lg mx-auto bg-[#3643BA] flex flex-col items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                <p className="mt-4">Chargement du parcours...</p>
            </div>
        );
    }

    if (!parcours) {
        return (
            <div className="relative h-screen w-full max-w-lg mx-auto bg-[#3643BA] flex flex-col items-center justify-center text-white">
                <p>Parcours non trouvé</p>
                <Link href="/home" className="mt-4 px-4 py-2 bg-white text-[#3643BA] rounded-md">
                    Retour à l&apos;accueil
                </Link>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full max-w-lg mx-auto bg-white flex flex-col text-black">
            <nav className="w-full bg-[#3643BA] text-white p-4 flex justify-between items-center shadow">
                <button onClick={() => router.back()} className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="flex items-center">
                    <span className="text-lg font-normal">DÉTAILS DU PARCOURS</span>
                </div>
                <div className="w-6"></div> {/* Espace vide pour équilibrer la navbar */}
            </nav>

            {/* Carte du parcours */}
            <div className="rounded-lg overflow-hidden relative">
                {isLoaded ? (
                    <>
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={parcours.origine}
                            zoom={13}
                            options={{
                                disableDefaultUI: true,
                                styles: [
                                    {
                                        featureType: "poi",
                                        elementType: "all",
                                        stylers: [{ visibility: "off" }]
                                    },
                                    // {
                                    //     featureType: "transit",
                                    //     elementType: "all",
                                    //     stylers: [{ visibility: "off" }]
                                    // },
                                    {
                                        featureType: "road",
                                        elementType: "labels",
                                        stylers: [{ visibility: "off" }]
                                    }
                                ]
                            }}
                            onLoad={handleMapLoad}
                        >
                            {currentPosition && (
                                <Marker
                                    position={currentPosition}
                                    icon={icon ? icon : undefined}
                                />
                            )}

                            {/* Marqueur du point de départ avec la lettre A */}
                            <Marker
                                position={parcours.origine}
                                icon={createCustomMarker('A', '#4CAF50')} // vert
                            />

                            {/* Marqueurs des points intermédiaires avec les lettres B, C, etc. */}
                            {parcours.pointsIntermediaires.map((point, index) => {
                                const letter = String.fromCharCode(66 + index);
                                return (
                                    <Marker
                                        key={index}
                                        position={point.location}
                                        icon={createCustomMarker(letter, getPointColor(index))}
                                    />
                                );
                            })}

                            {/* Marqueur du point d'arrivée avec la dernière lettre */}
                            <Marker
                                position={parcours.destination}
                                icon={createCustomMarker(String.fromCharCode(66 + parcours.pointsIntermediaires.length), '#F44336')} // rouge
                            />

                            {directionsOptions && (
                                <DirectionsService
                                    options={directionsOptions}
                                    callback={directionsCallback}
                                />
                            )}

                            {directions && (
                                <DirectionsRenderer
                                    options={{
                                        ...rendererOptions,
                                        directions: directions,
                                        // Supprimez les marqueurs par défaut du DirectionsRenderer
                                        suppressMarkers: true
                                    }}
                                />
                            )}
                        </GoogleMap>

                        {/* Bouton de caméra en bas à droite de la carte */}
                        <button
                            onClick={toggleCamera}
                            className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg z-10"
                            aria-label="Prendre un selfie"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3643BA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </>
                ) : (
                    <div className="bg-gray-200 h-[300px] flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3643BA]"></div>
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="bg-white rounded-lg p-4 text-black mb-4">
                    <h1 className="text-xl font-bold text-[#3643BA] mb-2">{parcours.nom}</h1>
                    <div className="flex items-center mb-3">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${parcours.niveau === 'débutant'
                            ? 'bg-[#ADFE04] text-[#131316]'
                            : parcours.niveau === 'intermédiaire'
                                ? 'bg-yellow-100 text-[#131316]'
                                : 'bg-red-100 text-[#131316]'
                            }`}>
                            {parcours.niveau}
                        </span>
                        <span className="ml-2 text-sm text-gray-600">{parcours.ville}</span>
                    </div>
                    <p className="text-gray-700 mb-3">{parcours.description}</p>

                    {/* Détails du parcours */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-gray-600 ml-1">{parcours.dureeEstimee}</span>
                        </div>
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            <span className="text-sm text-gray-600 ml-1">{parcours.distance}</span>
                        </div>
                    </div>
                </div>

                {/* Bouton de localisation */}
                {!locationPermissionRequested && (
                    <div className="mb-4">
                        <button
                            onClick={requestLocation}
                            className="w-full bg-white text-[#3643BA] font-semibold py-3 px-4 rounded-lg text-center hover:shadow-lg transition-shadow duration-300 flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Utiliser ma position actuelle
                        </button>
                    </div>
                )}



                {/* Affichage du temps jusqu'au point de départ */}
                {locationPermissionRequested && !geolocationError && (
                    <div className="mb-4 bg-white rounded-lg p-4 text-black">
                        <h3 className="text-lg font-semibold text-[#3643BA] mb-2">Temps jusqu&apos;au point de départ</h3>

                        {calculatingRoute ? (
                            <div className="flex items-center justify-center py-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#3643BA] mr-2"></div>
                                <span>Calcul en cours...</span>
                            </div>
                        ) : timeToStart && distanceToStart ? (
                            <div className="flex flex-col">
                                <div className="flex items-center mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Temps de marche : <strong>{timeToStart}</strong></span>
                                </div>
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    <span>Distance : <strong>{distanceToStart}</strong></span>
                                </div>
                                <div className="mt-3 text-sm text-gray-600">
                                    <p>Ces informations vous indiquent le temps et la distance pour rejoindre le point de départ du parcours depuis votre position actuelle.</p>
                                </div>
                            </div>
                        ) : (
                            <p>Impossible de calculer le temps jusqu&apos;au point de départ.</p>
                        )}
                    </div>
                )}

                {/* Bouton de redirection vers Google Maps */}
                <div className="mb-4">
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${parcours.origine.lat},${parcours.origine.lng}&destination=${parcours.destination.lat},${parcours.destination.lng}&waypoints=${parcours.pointsIntermediaires.map(p => `${p.location.lat},${p.location.lng}`).join('|')}&travelmode=walking`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-white text-[#3643BA] font-semibold py-3 px-4 rounded-lg text-center hover:shadow-lg transition-shadow duration-300 flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="#3643BA">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        Voir le parcours sur Google Maps
                    </a>
                </div>
            </div>

            {geolocationError && (
                <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                    <p>Note: {geolocationError}</p>
                    <p className="mt-1">La carte affiche toujours le parcours, mais votre position actuelle n&apos;est pas disponible.</p>
                    {locationPermissionRequested && (
                        <button
                            onClick={requestLocation}
                            className="mt-2 px-3 py-1 bg-yellow-200 text-yellow-800 rounded-md text-xs font-medium"
                        >
                            Réessayer
                        </button>
                    )}
                </div>
            )}

            <div className="bg-white rounded-lg p-4 text-black mb-4 ml-4">
                <h2 className="text-lg font-semibold text-[#3643BA] mb-3">Points d&apos;intérêt</h2>
                <ul className="space-y-0">
                    <li className="flex items-center py-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold mr-2">A</div>
                        <div>
                            <p className="font-medium">{parcours.origine.nom}</p>
                            <p className="text-xs text-gray-500">Point de départ</p>
                        </div>
                    </li>

                    {/* Trait séparateur */}
                    <div style={{ width: '311px', height: '0.5px', background: '#5E6074', opacity: 0.5 }}></div>

                    {parcours.pointsIntermediaires.map((point, index) => {
                        // Utiliser B, C, D... pour les points intermédiaires
                        const letter = String.fromCharCode(66 + index); // B commence à 66 en ASCII
                        // Utiliser la même fonction de couleur que pour la carte
                        const bgColorClass = index === 0 ? "bg-yellow-500" : "bg-[#3F51B5]";
                        return (
                            <React.Fragment key={`point-group-${index}`}>
                                <li className="flex items-center py-3">
                                    <div className={`flex items-center justify-center w-6 h-6 rounded-full ${bgColorClass} text-white text-xs font-bold mr-2`}>{letter}</div>
                                    <div>
                                        <p className="font-medium">{point.location.nom}</p>
                                        <p className="text-xs text-gray-500">Point intermédiaire</p>
                                    </div>
                                </li>

                                {/* Trait séparateur (sauf après le dernier point intermédiaire) */}
                                {index < parcours.pointsIntermediaires.length - 1 && (
                                    <div style={{ width: '311px', height: '0.5px', background: '#5E6074', opacity: 0.5 }}></div>
                                )}
                            </React.Fragment>
                        );
                    })}

                    {/* Trait séparateur avant le point d'arrivée */}
                    <div style={{ width: '311px', height: '0.5px', background: '#5E6074', opacity: 0.5 }}></div>

                    <li className="flex items-center py-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold mr-2">{String.fromCharCode(66 + parcours.pointsIntermediaires.length)}</div>
                        <div>
                            <p className="font-medium">{parcours.destination.nom}</p>
                            <p className="text-xs text-gray-500">Point d&apos;arrivée</p>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Nouvelles statistiques */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4 ml-4">
                <h3 className="text-lg font-semibold text-[#3643BA] mb-4">Moyenne du parcour</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-3xl font-bold text-[#3643BA]">{parcours.calories}</p>
                        <p className="text-xs text-center text-gray-500">Calories</p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-3xl font-bold   text-[#3643BA]">{parcours.vitesse}</p>
                        <p className="text-xs text-center text-gray-500">Km/h</p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-3xl font-bold text-[#3643BA]">{parcours.denivele}</p>
                        <p className="text-xs text-center text-gray-500">Dénivelé</p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-3xl font-bold text-[#3643BA]">{parcours.bpm || 'N/A'}</p>
                        <p className="text-xs text-center text-gray-500">BPM</p>
                    </div>
                </div>
            </div>


            {/* Composant Camera qui s'affiche lorsque showCamera est true */}
            {showCamera && (
                <div className="fixed inset-0 z-50 bg-black">
                    <Camera onClose={toggleCamera} />
                </div>
            )}
        </div>
    );
}
