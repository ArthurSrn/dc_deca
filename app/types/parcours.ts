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
