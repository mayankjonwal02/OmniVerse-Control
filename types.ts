
export interface CelestialBody {
  name: string;
  radius: number;
  distance: number;
  speed: number;
  color: string;
  description: string;
  textureUrl?: string;
}

export interface HandGestureData {
  x: number;
  y: number;
  z: number;
  pinchDistance: number;
  isPinching: boolean;
  isOpenHand: boolean;
}

export interface CosmicFact {
  title: string;
  content: string;
  source: string;
}

export type SectorType = 'solar-system' | 'andromeda' | 'black-hole' | 'nebula' | 'universe';

export interface CosmicSector {
  id: SectorType;
  name: string;
  description: string;
  position: [number, number, number];
}
