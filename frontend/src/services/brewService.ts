import { Brew, BrewFormData } from '../types';

const API_BASE = '/api';

const parseError = async (res: Response): Promise<string> => {
  try {
    const data = await res.json();
    if (Array.isArray(data?.errors)) {
      return data.errors.join(', ');
    }
    return data?.error || data?.message || `Request failed (${res.status})`;
  } catch {
    return `Request failed (${res.status})`;
  }
};

export const getBrews = async (): Promise<Brew[]> => {
  const res = await fetch(`${API_BASE}/brews`);
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return (await res.json()) as Brew[];
};

export const createBrew = async (brewData: BrewFormData): Promise<Brew> => {
  const res = await fetch(`${API_BASE}/brews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(brewData),
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return (await res.json()) as Brew;
};

export const updateBrew = async (id: string, brewData: BrewFormData): Promise<Brew> => {
  const res = await fetch(`${API_BASE}/brews/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(brewData),
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return (await res.json()) as Brew;
};

export const deleteBrew = async (id: string): Promise<boolean> => {
  const res = await fetch(`${API_BASE}/brews/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  const data = (await res.json()) as { success: boolean };
  return data.success;
};

export const resetBrews = async (): Promise<Brew[]> => {
  const res = await fetch(`${API_BASE}/brews/reset`, {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return (await res.json()) as Brew[];
};

export const setupDatabase = async (): Promise<void> => {
  const res = await fetch(`${API_BASE}/setup-db`, {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }
};
