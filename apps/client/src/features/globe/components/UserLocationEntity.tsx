import * as Cesium from 'cesium';
import { Entity } from 'resium';

import type { User } from '../../../types/users';
import {
  USER_ENTITY_ID_PREFIX,
  USER_LABEL_FONT,
  USER_LABEL_SCALE_BY_DISTANCE,
  USER_POINT_OUTLINE_WIDTH,
  USER_POINT_PIXEL_SIZE,
} from '../config/constants';
import { createPointProps } from '../config/pointConfig';
import { getDisableDepthTestDistance } from '../entityConfig';

type Props = { user: User };

export const UserLocationEntity = ({ user }: Props) => {
  const position = Cesium.Cartesian3.fromDegrees(user.longitude, user.latitude, 0);
  const disableDepthTestDistance = getDisableDepthTestDistance();

  const [near, nearValue, far, farValue] = USER_LABEL_SCALE_BY_DISTANCE;

  return (
    <Entity
      id={`${USER_ENTITY_ID_PREFIX}${user.id}`}
      name={user.login}
      position={position}
      point={createPointProps({
        pixelSize: USER_POINT_PIXEL_SIZE,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: USER_POINT_OUTLINE_WIDTH,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance,
      })}
      label={{
        text: user.login,
        fillColor: Cesium.Color.WHITE,
        font: USER_LABEL_FONT,
        showBackground: true,
        backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        pixelOffset: new Cesium.Cartesian2(10, 0),
        scaleByDistance: new Cesium.NearFarScalar(near, nearValue, far, farValue),
      }}
    />
  );
};
