export type BrewMethod = 'Aeropress' | 'Drip coffee' | 'V60' | 'French Press' | 'Chemex';

export interface Brew {
  id: string;
  beans: string;
  method: BrewMethod;
  coffeeGrams: number;
  waterGrams: number;
  rating: number; // 0 to 5
  tastingNotes?: string;
  createdAt?: string;
}

export type BrewFormData = Omit<Brew, 'id' | 'createdAt'>;

export type MethodFilterType = 'All methods' | BrewMethod;

export interface ValidationErrors {
  beans?: string;
  method?: string;
  coffeeGrams?: string;
  waterGrams?: string;
  rating?: string;
}
