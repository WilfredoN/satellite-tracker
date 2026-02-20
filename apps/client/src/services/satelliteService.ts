import { API_URL } from '.';
import type { AddSatelliteData, Satellite } from '../types/satellite';
import { mapApiToSatellite } from './mappers';

export const satelliteService = {
  async getAll(): Promise<Satellite[]> {
    try {
      const res = await fetch(`${API_URL}/satellites`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Response status: ${res.status}`);
      const data = await res.json();
      return (data.satellites || []).map(mapApiToSatellite);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async add(satellite: AddSatelliteData): Promise<Satellite> {
    try {
      const res = await fetch(`${API_URL}/satellites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: satellite.name,
          tle_1: satellite.tle1,
          tle_2: satellite.tle2,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        const errorMsg = data?.error?.message || `Response status: ${res.status}`;
        const errorCode = data?.error?.code || res.status;
        throw new Error(`${errorMsg} (code: ${errorCode})`);
      }
      return { id: String(Date.now()), ...satellite };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async remove(id: string): Promise<void> {
    try {
      const res = await fetch(`${API_URL}/satellites/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Response status: ${res.status}`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
