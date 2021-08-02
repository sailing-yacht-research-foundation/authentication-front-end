import 'leaflet/dist/leaflet.css';

import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';

export const MapView = (props) => {

    const { zoom } = props;

    const map = useMap();

    useEffect(() => {
        new L.TileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAP_BOX_API_KEY}`, {
            attribution: '<a href="https://www.github.com/sailing-yacht-research-foundation"><img src="https://syrf.io/wp-content/themes/syrf/assets/svg/icon-github.svg"></img></a>',
            maxZoom: 18,
            id: 'jweisbaum89/cki2dpc9a2s7919o8jqyh1gss',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'your.mapbox.access.token'
        }).addTo(map);

        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition((position) => {
                map.setView({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }, zoom);
            });

    }, []);

    return (
        <>
        </>
    );
}