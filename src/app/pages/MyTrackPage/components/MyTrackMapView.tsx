import React, { useRef, useEffect } from "react";
import { MapContainer } from "react-leaflet";
import { StyleConstants } from 'styles/StyleConstants';

import { MAP_DEFAULT_VALUE } from "utils/constants";
import { MyTrackMap } from "./MyTrackMap";

export const MyTrackMapView = (props) => {
  const mapContainerRef = useRef<any>();

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
      window.removeEventListener("resize", () => {});
    };
  }, []);

  return (
      <div style={{ position: "relative" }}>
        <MapContainer
          style={{
            height: `calc(${window.innerHeight}px - ${StyleConstants.NAV_BAR_HEIGHT} - ${StyleConstants.TAB_BAR_HEIGHT})`,
            width: "100%",
            zIndex: 1
          }}
          center={MAP_DEFAULT_VALUE.CENTER}
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
          <MyTrackMap />
        </MapContainer>
      </div>
  );
};
