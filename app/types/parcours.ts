export interface PointInteret {
  lat: number;
  lng: number;
  nom: string;
}

export interface PointIntermediaire {
  location: PointInteret;
  stopover: boolean;
}

export interface ParcoursData {
  nom: string;
  origine: PointInteret;
  destination: PointInteret;
  pointsIntermediaires: PointIntermediaire[];
  description: string;
  distance: string;
  dureeEstimee: string;
}

export type ParcoursCollection = Record<string, ParcoursData>;

export interface ParcoursType {
  nom: string;
  ville: string;
  niveau: string;
  image: string;
  description: string;
  distance: string;
  dureeEstimee: string;
  urlImage: string;
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
