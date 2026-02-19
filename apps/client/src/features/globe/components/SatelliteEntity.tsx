import * as Cesium from 'cesium';
import { useMemo } from 'react';
import { Entity } from 'resium';
import type { Satellite } from '../../../types/satellite';
import { tleToCartesian } from '../helpers/tleToCartesian';
import { getDisableDepthTestDistance } from '../entityConfig';
import { LABEL_SCALE_BY_DISTANCE, LABEL_FONT, POINT_OUTLINE_WIDTH } from '../config/constants';
import { createPointProps } from '../config/pointConfig';

type Props = { satellite: Satellite };

export const SatelliteEntity = ({ satellite }: Props) => {
  const position = useMemo(
    () =>
      new Cesium.CallbackPositionProperty(
        (time) => {
          const julian = time ?? Cesium.JulianDate.now();
          const current = Cesium.JulianDate.toDate(julian);
          return tleToCartesian(satellite.tle1, satellite.tle2, current);
        },
        false,
        Cesium.ReferenceFrame.FIXED,
      ),
    [satellite.tle1, satellite.tle2],
  );

  const pointSize = useMemo(
    () =>
      new Cesium.CallbackProperty((time) => {
        const julian = time ?? Cesium.JulianDate.now();
        const date = Cesium.JulianDate.toDate(julian);
        const t = date.getTime() / 1500;
        return 8 + Math.abs(Math.sin(t)) * 6;
      }, false),
    [],
  );

  const disableDepthTestDistance = getDisableDepthTestDistance();

  return (
    <Entity
      id={satellite.id}
      name={satellite.name}
      position={position}
      point={createPointProps({
        pixelSize: pointSize,
        color: Cesium.Color.CHARTREUSE,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: POINT_OUTLINE_WIDTH,
        disableDepthTestDistance,
      })}
      label={{
        text: satellite.name,
        fillColor: Cesium.Color.CHARTREUSE,
        font: LABEL_FONT,
        showBackground: true,
        backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        pixelOffset: new Cesium.Cartesian2(10, 0),
        scaleByDistance: new Cesium.NearFarScalar(
          LABEL_SCALE_BY_DISTANCE[0],
          LABEL_SCALE_BY_DISTANCE[1],
          LABEL_SCALE_BY_DISTANCE[2],
          LABEL_SCALE_BY_DISTANCE[3],
        ),
      }}
      path={{
        resolution: 24,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.2,
          color: Cesium.Color.CYAN.withAlpha(0.7),
        }),
        width: 4,
        leadTime: 3600,
        trailTime: 1800,
      }}
    />
  );
};
