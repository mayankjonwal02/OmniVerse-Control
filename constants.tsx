
import { CelestialBody, CosmicSector } from './types';

export const SOLAR_SYSTEM_DATA: CelestialBody[] = [
  { name: 'Sun', radius: 4, distance: 0, speed: 0, color: '#ffcc33', description: 'The star at the center of the Solar System.' },
  { name: 'Mercury', radius: 0.5, distance: 8, speed: 0.04, color: '#A5A5A5', description: 'The smallest and innermost planet.' },
  { name: 'Venus', radius: 0.9, distance: 12, speed: 0.015, color: '#E3BB76', description: 'The second planet from the Sun.' },
  { name: 'Earth', radius: 1, distance: 16, speed: 0.01, color: '#2233FF', description: 'Our home planet, the third from the Sun.' },
  { name: 'Mars', radius: 0.6, distance: 22, speed: 0.008, color: '#E27B58', description: 'The Red Planet.' },
  { name: 'Jupiter', radius: 2.2, distance: 32, speed: 0.002, color: '#D39C7E', description: 'The largest planet in our solar system.' },
  { name: 'Saturn', radius: 1.8, distance: 42, speed: 0.0009, color: '#C5AB6E', description: 'Known for its prominent ring system.' },
  { name: 'Uranus', radius: 1.2, distance: 52, speed: 0.0004, color: '#BBE1E4', description: 'An ice giant.' },
  { name: 'Neptune', radius: 1.1, distance: 60, speed: 0.0001, color: '#6081FF', description: 'The most distant planet from the Sun.' },
];

export const COSMIC_SECTORS: CosmicSector[] = [
  { 
    id: 'solar-system', 
    name: 'Solar System', 
    description: 'The neighborhood of our home planet, Earth.',
    position: [0, 0, 0]
  },
  { 
    id: 'andromeda', 
    name: 'Andromeda', 
    description: 'A massive spiral galaxy 2.5 million light-years away.',
    position: [2000, 500, -1000]
  },
  { 
    id: 'black-hole', 
    name: 'Gargantua', 
    description: 'The supermassive black hole at the center of the Milky Way.',
    position: [-500, -1500, 2000]
  },
  { 
    id: 'nebula', 
    name: 'Orion Nebula', 
    description: 'A stellar nursery where new stars are born.',
    position: [1000, 1000, 1000]
  },
  { 
    id: 'universe', 
    name: 'The Cosmic Web', 
    description: 'The grand scale structure of the entire observable universe.',
    position: [0, 0, -5000]
  }
];
