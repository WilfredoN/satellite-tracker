import * as Cesium from 'cesium';
import type * as CesiumType from 'cesium';
import { useEffect, useMemo, useRef } from 'react';
import type { CesiumComponentRef } from 'resium';
import { Viewer } from 'resium';
import { VIEWER_PROPS, toUserEntityId } from '../config/constants';
import { useSatellites } from '../../../components/satellites/hooks/useSatellites';
import { ISS_PLACEHOLDER } from '../../../services/mocks/placeholderSatellite';
import { useSatelliteStore } from '../../../store';
import { useRealtimeClock } from '../hooks/useRealtimeClock';

import { SatellitesLayer } from './SatellitesLayer';
import { SatelliteDetails } from './SatelliteDetails';

export const Globe = () => {
  const { satellites, error, isLoading, isFetching } = useSatellites('', true);
  const viewerRef = useRef<CesiumComponentRef<CesiumType.Viewer>>(null);
  const selectedTarget = useSatelliteStore((state) => state.selectedTarget);

  useRealtimeClock(viewerRef);
  const sats = useMemo(() => {
    const issId = ISS_PLACEHOLDER.id;
    if (error || isLoading || isFetching) {
      return [ISS_PLACEHOLDER];
    }
    if (!satellites || satellites.length === 0) {
      return [];
    }
    return satellites.filter((satellite) => satellite.id !== issId);
  }, [error, isLoading, isFetching, satellites]);

  useEffect(() => {
    if (!viewerRef.current?.cesiumElement) return;
    const viewer = viewerRef.current.cesiumElement;
    try {
      viewer.scene.globe.depthTestAgainstTerrain = true;
    } catch (err) {
      console.error('Failed to enable depth test against terrain', err);
    }

    try {
      if (viewer.cesiumWidget && 'selectionIndicator' in viewer.cesiumWidget) {
        const indicator = viewer.cesiumWidget.selectionIndicator as {
          viewModel: { showSelection: boolean };
        };
        indicator.viewModel.showSelection = false;
      }

      const handler = viewer.screenSpaceEventHandler;
      if (handler) {
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
      }
    } catch (err) {
      console.error('Failed to disable viewer input/selection handlers', err);
    }
  }, []);

  useEffect(() => {
    if (!viewerRef.current?.cesiumElement) return;
    const viewer = viewerRef.current.cesiumElement;

    if (!selectedTarget) {
      viewer.trackedEntity = undefined;
      try {
        viewer.scene?.camera?.cancelFlight?.();
        viewer.scene.camera.flyHome(3);
      } catch (err) {
        console.error('Error flying home', err);
      }
      return;
    }

    try {
      const entityId =
        selectedTarget.type === 'satellite'
          ? selectedTarget.data.id
          : toUserEntityId(selectedTarget.userId);
      const entity = viewer.entities.getById(entityId);
      if (entity) {
        viewer.scene?.camera?.cancelFlight?.();
        viewer.flyTo(entity, { duration: 1.5 });
        if (selectedTarget.type === 'satellite') {
          viewer.trackedEntity = entity;
        }
      }
    } catch (err) {
      console.error('Error flying to selected target', err);
    }
  }, [selectedTarget]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-(--foreground) bg-(--panel-bg) shadow-(--glow) h-fit border-2 p-1">
        <Viewer ref={viewerRef} {...VIEWER_PROPS}>
          <SatellitesLayer satellites={sats} />
        </Viewer>
      </div>
      <SatelliteDetails />
    </div>
  );
};
