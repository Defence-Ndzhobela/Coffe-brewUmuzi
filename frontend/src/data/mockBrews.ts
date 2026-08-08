import { Brew } from '../types';

export const INITIAL_MOCK_BREWS: Brew[] = [
  {
    id: 'brew-1',
    beans: 'Zimbabwean highlands',
    method: 'Aeropress',
    coffeeGrams: 15,
    waterGrams: 200,
    rating: 3,
    tastingNotes: 'Heavy body, soft finish, nutty',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: 'brew-2',
    beans: 'Nigerian dark roast',
    method: 'Drip coffee',
    coffeeGrams: 10,
    waterGrams: 120,
    rating: 1,
    tastingNotes: 'Roasty, dark cocoa finish',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'brew-3',
    beans: 'Italian decaf',
    method: 'V60',
    coffeeGrams: 20,
    waterGrams: 180,
    rating: 4,
    tastingNotes: 'Smooth, caramelized chocolate, subtle floral notes',
    createdAt: new Date().toISOString(),
  },
];
