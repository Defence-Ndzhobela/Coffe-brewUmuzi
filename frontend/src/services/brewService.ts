import { Brew, BrewFormData } from '../types';
import { INITIAL_MOCK_BREWS } from '../data/mockBrews';

const STORAGE_KEY = 'brew_log_records_v1';

/**
 * Service layer for Brew records.
 * Currently backed by LocalStorage for frontend standalone mode.
 * 
 * FUTURE BACKEND INTEGRATION POINT:
 * Replace these local functions with HTTP fetch calls to a Node.js/Express API.
 */

/**
 * Retrieve all brew records.
 * FUTURE REST EQUIVALENT: GET /api/brews
 */
export const getBrews = (): Brew[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Seed with initial mock data if first time
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_BREWS));
      return INITIAL_MOCK_BREWS;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : INITIAL_MOCK_BREWS;
  } catch (error) {
    console.error('Failed to read brews from localStorage:', error);
    return INITIAL_MOCK_BREWS;
  }
};

/**
 * Save all brews to localStorage helper.
 */
const saveAllBrews = (brews: Brew[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(brews));
  } catch (error) {
    console.error('Failed to save brews to localStorage:', error);
  }
};

/**
 * Create a new brew record.
 * FUTURE REST EQUIVALENT: POST /api/brews
 * Body: { beans, method, coffeeGrams, waterGrams, rating, tastingNotes }
 */
export const createBrew = (brewData: BrewFormData): Brew => {
  const currentBrews = getBrews();
  const newBrew: Brew = {
    ...brewData,
    id: `brew-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    createdAt: new Date().toISOString(),
  };

  const updated = [newBrew, ...currentBrews];
  saveAllBrews(updated);
  return newBrew;
};

/**
 * Update an existing brew record by ID.
 * FUTURE REST EQUIVALENT: PUT /api/brews/:id
 * Body: { beans, method, coffeeGrams, waterGrams, rating, tastingNotes }
 */
export const updateBrew = (id: string, brewData: Partial<BrewFormData>): Brew => {
  const currentBrews = getBrews();
  let updatedBrew: Brew | null = null;

  const updated = currentBrews.map((brew) => {
    if (brew.id === id) {
      updatedBrew = {
        ...brew,
        ...brewData,
      };
      return updatedBrew;
    }
    return brew;
  });

  if (!updatedBrew) {
    throw new Error(`Brew with ID "${id}" not found.`);
  }

  saveAllBrews(updated);
  return updatedBrew;
};

/**
 * Delete a brew record by ID.
 * FUTURE REST EQUIVALENT: DELETE /api/brews/:id
 */
export const deleteBrew = (id: string): boolean => {
  const currentBrews = getBrews();
  const filtered = currentBrews.filter((brew) => brew.id !== id);
  if (filtered.length === currentBrews.length) {
    return false;
  }
  saveAllBrews(filtered);
  return true;
};

/**
 * Reset brew records back to initial mock data.
 * Useful for demo/testing purposes.
 */
export const resetToMockData = (): Brew[] => {
  saveAllBrews(INITIAL_MOCK_BREWS);
  return INITIAL_MOCK_BREWS;
};
