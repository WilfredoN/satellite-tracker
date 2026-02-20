import type { Satellite,SatelliteApi } from '../../types/satellite';

export const mapApiToSatellite = (api: SatelliteApi): Satellite => {
  return {
    id: String(api.id),
    name: api.name,
    tle1: api.tle_1,
    tle2: api.tle_2,
  };
};
