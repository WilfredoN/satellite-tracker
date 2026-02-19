import * as Cesium from 'cesium';

export type PointOptions = {
  pixelSize: number | Cesium.Property | Cesium.CallbackProperty;
  color?: Cesium.Color;
  outlineColor?: Cesium.Color;
  outlineWidth?: number;
  heightReference?: Cesium.HeightReference;
  disableDepthTestDistance?: number;
};

type PointGraphicsOptions = {
  pixelSize: number | Cesium.Property | Cesium.CallbackProperty;
  color: Cesium.Color;
  outlineColor: Cesium.Color;
  outlineWidth: number;
  heightReference?: Cesium.HeightReference;
  disableDepthTestDistance?: number;
};

export const createPointProps = (opts: PointOptions): PointGraphicsOptions => {
  const {
    pixelSize,
    color = Cesium.Color.WHITE,
    outlineColor = Cesium.Color.WHITE,
    outlineWidth = 2,
    heightReference,
    disableDepthTestDistance,
  } = opts;

  const point: PointGraphicsOptions = {
    pixelSize,
    color,
    outlineColor,
    outlineWidth,
  };

  if (typeof heightReference !== 'undefined') point.heightReference = heightReference;
  if (typeof disableDepthTestDistance !== 'undefined')
    point.disableDepthTestDistance = disableDepthTestDistance;

  return point;
};
