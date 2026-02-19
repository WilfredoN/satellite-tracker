export const FORCE_DISABLE_DEPTH_TEST = false;

export const getDisableDepthTestDistance = (): number | undefined => {
  return FORCE_DISABLE_DEPTH_TEST ? Number.POSITIVE_INFINITY : undefined;
};
