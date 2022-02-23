import React, { useRef, useEffect } from "react";
import { MapContainer } from "react-leaflet";
import { useSelector } from 'react-redux';

import { StyleConstants } from 'styles/StyleConstants';
import { MAP_DEFAULT_VALUE } from "utils/constants";

import { MyTrackMap } from "./MyTrackMap";
import { selectUserCoordinate } from "app/pages/LoginPage/slice/selectors";

export const MyTrackMapView = React.forwardRef<any, any>((props, ref) => {
  const mapContainerRef = useRef<any>();
  const mapViewRef = useRef<any>();
  const userCoordinate = useSelector(selectUserCoordinate);

  const handleResize = () => {
    const { current } = mapContainerRef;
    if (!current) return;

    const navHeight = 73;
    const tabHeight = 76;
    mapContainerRef.current._container.style.height = (window.innerHeight - navHeight - tabHeight) + 'px';
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", () => { });
    };
  }, []);

  const mapCenter = {
    lat: userCoordinate?.lat || MAP_DEFAULT_VALUE.CENTER.lat,
    lng: userCoordinate?.lon || MAP_DEFAULT_VALUE.CENTER.lng
  };

  React.useImperativeHandle(ref, () => ({
    reload() {
      mapViewRef?.current?.reload();
    }
  }));

  return (
    <div style={{ position: "relative" }}>
      <MapContainer
        style={{
          height: `calc(${window.innerHeight}px - ${StyleConstants.NAV_BAR_HEIGHT} - ${StyleConstants.TAB_BAR_HEIGHT})`,
          width: "100%",
          zIndex: 1
        }}
        center={mapCenter}
        zoom={MAP_DEFAULT_VALUE.ZOOM}
        zoomSnap={0.2}
        zoomAnimation={false}
        markerZoomAnimation={false}
        fadeAnimation={false}
        zoomAnimationThreshold={0}
        inertia={false}
        zoomanim={false}
        animate={false}
        duration={0}
        easeLinearity={0}
        scrollWheelZoom="center"
        whenCreated={(mapInstance: any) => (mapContainerRef.current = mapInstance)}
      >
        <MyTrackMap ref={mapViewRef} />
      </MapContainer>
    </div>
  );
});
