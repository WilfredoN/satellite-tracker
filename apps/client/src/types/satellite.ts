export interface TLE {
  tle1: string;
  tle2: string;
}

export interface AddSatelliteData extends TLE {
  name: string;
}

export interface Satellite extends AddSatelliteData {
  id: string;
}

export interface SatelliteApi {
  id: string;
  name: string;
  tle_1: string;
  tle_2: string;
  added_at?: string;
}

export type SatelliteTarget = {
  readonly type: 'satellite';
  readonly data: Satellite;
};

export type UserTarget = {
  readonly type: 'user';
  readonly userId: string;
  readonly userName: string;
};

export type SelectableTarget = SatelliteTarget | UserTarget;
