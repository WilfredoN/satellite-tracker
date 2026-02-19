import * as Cesium from 'cesium';
import { tleToCartesian } from './tleToCartesian';
import type { TLE } from '../../../types/satellite';

type Position = {
  readonly lat: number;
  readonly lon: number;
  readonly alt: number;
};

type TelemetryData = {
  readonly eccentricity: number | undefined;
  readonly perigee: number | undefined;
  readonly meanAnomaly: number | undefined;
  readonly meanMotion: number | undefined;
  readonly speed: number | undefined;
};

export const getSatellitePosition = ({ tle1, tle2 }: TLE): Position | undefined => {
  if (!tle1 || !tle2) return undefined;
  const now = new Date();
  const cartesian = tleToCartesian(tle1, tle2, now);
  if (!cartesian) return undefined;
  const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
  if (!cartographic) return undefined;
  const lat = Cesium.Math.toDegrees(cartographic.latitude);
  const lon = Cesium.Math.toDegrees(cartographic.longitude);
  const alt = cartographic.height;
  return { lat, lon, alt };
};

export const getUserPosition = (latitude: number, longitude: number): Position => ({
  lat: latitude,
  lon: longitude,
  alt: 0,
});

export const parseTelemetry = ({ tle2 }: TLE): TelemetryData => {
  const eccentricity = tle2 ? parseFloat(`0.${tle2.substring(26, 33)}`) : undefined;
  const perigee = tle2 ? parseFloat(tle2.substring(34, 42)) : undefined;
  const meanAnomaly = tle2 ? parseFloat(tle2.substring(43, 51)) : undefined;
  const meanMotion = tle2 ? parseFloat(tle2.substring(52, 63)) : undefined;
  const speed = meanMotion ? calculateSpeed(meanMotion) : undefined;
  return { eccentricity, perigee, meanAnomaly, meanMotion, speed };
};

const calculateSpeed = (meanMotion: number): number => {
  const mu = 398600.4418;
  const period = 86400 / meanMotion;
  const semiMajorAxis = Math.cbrt(mu * Math.pow(period / (2 * Math.PI), 2));
  return Math.sqrt(mu / semiMajorAxis);
};
