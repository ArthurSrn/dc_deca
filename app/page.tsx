'use client'
import React, { useMemo, useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer, Libraries } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const origin = {
  lat: 48.864824,
  lng: 2.334595
};

const destination = {
  lat: 48.858370,
  lng: 2.294481
};

const waypoints = [
  {
    location: { lat: 48.872829842, lng: 2.321332048 },
    stopover: true
  },
  {
    location: { lat: 48.866667, lng: 2.333333 },
    stopover: true
  }
];

interface Position {
  lat: number;
  lng: number;
}

type ModeDeplacements = 'marche' | 'course';

const libraries: Libraries = ["places"];

const GoogleMapRouteComponent = () => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [travelTime, setTravelTime] = useState<string | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [icon, setIcon] = useState<google.maps.Icon | null>(null);
  const pointNames = [
    "Départ (Louvre)",
    "Tour Eiffel",
    "Arc de Triomphe",
    "Arrivée (Notre-Dame)"
  ];
  const [modeDeplacement, setModeDeplacement] = useState<ModeDeplacements>('marche');
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
        }
      );
    } else {
      console.error("La géolocalisation n'est pas supportée par ce navigateur.");
    }
  }, []);

  // Calculer le temps estimé en fonction du mode de déplacement
  useEffect(() => {
    if (distanceMeters) {
      // Vitesse en mètres par seconde
      const vitesse = modeDeplacement === 'marche' ? 1.4 : 2.8; // 5 km/h pour marche, 10 km/h pour course
      const tempsEnSecondes = distanceMeters / vitesse;

      // Convertir en heures et minutes
      const heures = Math.floor(tempsEnSecondes / 3600);
      const minutes = Math.floor((tempsEnSecondes % 3600) / 60);

      let tempsFormate = '';
      if (heures > 0) {
        tempsFormate += `${heures} h `;
      }
      tempsFormate += `${minutes} min`;

      setTravelTime(tempsFormate);
    }
  }, [modeDeplacement, distanceMeters]);

  const travelMode = "WALKING" as google.maps.TravelMode;

  const directionsOptions = useMemo(() => ({
    destination: destination,
    origin: origin,
    waypoints: waypoints,
    optimizeWaypoints: true,
    travelMode: travelMode
  }), [travelMode]);

  const rendererOptions = useMemo(() => ({
    polylineOptions: {
      strokeColor: '#2196F3',
      strokeWeight: 4,
      strokeOpacity: 1.0
    }
  }), []);

  const directionsCallback = React.useCallback(
    (
      result: google.maps.DirectionsResult | null,
      status: google.maps.DirectionsStatus
    ) => {
      if (status === 'OK' && result !== null) {
        setDirections(result);
        const route = result.routes[0].legs[0];

        // Stocker la distance en mètres pour le calcul du temps
        const distanceValue = route.distance?.value || 0;
        setDistanceMeters(distanceValue);

        // Afficher la distance
        setDistance(route.distance?.text || null);
      } else if (status !== 'OK') {
        console.error('Directions request failed due to ' + status);
      }
    },
    []
  );

  // Callback pour le chargement de la carte
  const handleMapLoad = () => {
    // Une fois la carte chargée, on peut créer l'icône
    if (window.google && !icon) {
      setIcon({
        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        scaledSize: new window.google.maps.Size(40, 40)
      });
    }
  };

  const openInGoogleMaps = () => {
    const waypointsString = waypoints
      .map(wp => `${wp.location.lat},${wp.location.lng}`)
      .join('|');

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&waypoints=${waypointsString}&travelmode=walking`;

    window.open(url, '_blank');
  };

  const goToStart = () => {
    if (currentPosition) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${currentPosition.lat},${currentPosition.lng}&destination=${origin.lat},${origin.lng}&travelmode=walking`;
      window.open(url, '_blank');
    }
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModeDeplacement(e.target.value as ModeDeplacements);
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
      libraries={libraries}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentPosition || origin}
        zoom={10}
        onLoad={handleMapLoad}
      >
        {currentPosition && (
          <Marker
            position={currentPosition}
            icon={icon ? icon : undefined}
          />
        )}
        <Marker position={origin} />
        <Marker position={destination} />
        <DirectionsService
          options={directionsOptions}
          callback={directionsCallback}
        />
        {directions && (
          <DirectionsRenderer
            options={{
              ...rendererOptions,
              directions: directions
            }}
          />
        )}
      </GoogleMap>
      <div className="p-4">
        <div className="mb-4">
          <label htmlFor="modeDeplacement" className="block text-sm font-medium text-gray-300 mb-1">
            Mode de déplacement
          </label>
          <select
            id="modeDeplacement"
            value={modeDeplacement}
            onChange={handleModeChange}
            className="block max-w-lg px-3 py-2 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option className='text-gray-950' value="marche">Marche (5 km/h)</option>
            <option value="course">Course (10 km/h)</option>
          </select>
        </div>

        {travelTime && <p className="text-gray-100">Temps estimé : {travelTime}</p>}
        {distance && <p className="text-gray-400">Distance totale : {distance}</p>}

        <div className="flex gap-4">
          <button
            onClick={openInGoogleMaps}
            className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2" type="button"
          >
            Ouvrir dans Google Maps
          </button>
          {currentPosition && (
            <button
              onClick={goToStart}
              className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2" type="button"
            >
              Aller au départ
            </button>
          )}
        </div>
        {/* Représentation textuelle du trajet */}
        {directions && directions.routes && directions.routes[0].legs && (
          <div className="mt-4 p-4 bg-black-50 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Détails du trajet</h3>
            <div className="flex flex-col md:flex-row flex-wrap items-start md:items-center">
              {directions.routes[0].legs.map((leg, index) => (
                <React.Fragment key={`text-leg-${index}`}>
                  {/* Point de départ */}
                  {index === 0 && (
                    <div className="flex items-center mb-2 md:mb-0">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                        D
                      </div>
                      <span className="ml-2 font-medium">{pointNames[0]}</span>
                    </div>
                  )}

                  {/* Ligne pointillée et temps */}
                  <div className="flex items-center mx-0 md:mx-2 my-2 md:my-0 w-full md:w-auto">
                    <div className="text-blue-500 mx-2 tracking-widest hidden md:block">- - - - -</div>
                    <div className="border-l-2 border-blue-500 h-6 mx-3 md:hidden"></div>
                    <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {leg.duration?.text || ""}
                    </div>
                    <div className="text-blue-500 mx-2 tracking-widest hidden md:block">- - - - -</div>
                  </div>

                  {/* Point intermédiaire ou d'arrivée */}
                  <div className="flex items-center mb-2 md:mb-0">
                    <div className={`w-6 h-6 rounded-full ${index === directions.routes[0].legs.length - 1 ? 'bg-red-500' : 'bg-yellow-500'} flex items-center justify-center text-white text-xs font-bold`}>
                      {index === directions.routes[0].legs.length - 1 ? 'A' : (index + 1)}
                    </div>
                    <span className="ml-2 font-medium">{pointNames[index + 1]}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

      </div>
    </LoadScript>
  );
};

export default React.memo(GoogleMapRouteComponent);
