export const VIEWER_PROPS = {
  baseLayerPicker: false,
  sceneModePicker: false,
  homeButton: false,
  animation: false,
  timeline: false,
  infoBox: false,
  selectionIndicator: false,
  navigationHelpButton: false,
  fullscreenButton: false,
  resolutionScale: 1.5,
  useBrowserRecommendedResolution: true,
  skyBox: false,
  skyAtmosphere: false,
  shadows: false,
  scene3DOnly: true,
  creditContainer: undefined,
} as const;

export const USER_ENTITY_ID_PREFIX = 'user-';
export const USER_POINT_PIXEL_SIZE = 10;
export const USER_POINT_OUTLINE_WIDTH = 2;
export const USER_LABEL_FONT = '12px Courier New';
export const USER_LABEL_SCALE_BY_DISTANCE = [150.0, 1.0, 15000000.0, 0.5] as const;

export const LABEL_SCALE_BY_DISTANCE = USER_LABEL_SCALE_BY_DISTANCE;
export const LABEL_FONT = USER_LABEL_FONT;
export const POINT_OUTLINE_WIDTH = 2;
export const SATELLITE_POINT_BASE = 8;

export const toUserEntityId = (userId: string): string => `${USER_ENTITY_ID_PREFIX}${userId}`;

export const isUserEntityId = (id: string): boolean => id.startsWith(USER_ENTITY_ID_PREFIX);
