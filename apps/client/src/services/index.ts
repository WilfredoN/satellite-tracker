export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export type { ApiErrorShape } from './apiError';
export { ApiError } from './apiError';
export { satelliteService } from './satelliteService';
export { usersService } from './usersService';
