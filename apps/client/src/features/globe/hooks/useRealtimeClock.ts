import * as Cesium from 'cesium';
import type { RefObject } from 'react';
import { useEffect } from 'react';
import type { CesiumComponentRef } from 'resium';

import { configureRealtimeClock } from '../helpers/realtimeClock';

type ViewerRef = RefObject<CesiumComponentRef<Cesium.Viewer> | null>;

export const useRealtimeClock = (viewerRef: ViewerRef) => {
  useEffect(() => {
    let frame: number;

    const initWhenReady = () => {
      const viewer = viewerRef.current?.cesiumElement;
      if (!viewer) {
        frame = requestAnimationFrame(initWhenReady);
        return;
      }

      configureRealtimeClock(viewer);
    };

    initWhenReady();

    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, [viewerRef]);
};
