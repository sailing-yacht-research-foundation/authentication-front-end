import 'leaflet/dist/leaflet.css';

import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { GiSailboat } from 'react-icons/gi';

const races = [
    {
        latlng: {
            lng: -343.167625,
            lat: 38.001357
        },
        name: 'Race over here'
    },
    {
        latlng: {
            lng: -346.729520,
            lat: 40.885278
        },
        name: 'Race over here'
    },
    {
        latlng: {
            lng: -355.527362,
            lat: 41.944783
        },
        name: 'Race over here'
    },
    {
        latlng: {
            lng: -368.117287,
            lat: 51.380010
        },
        name: 'Race over here'
    }
];

export const MapView = (props) => {

    const { zoom } = props;

    const map = useMap();

    useEffect(() => {
        initializeMapView();
        zoomToCurrentUserLocationIfAllowed();
        attachRaceMarkersToMap();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const zoomToCurrentUserLocationIfAllowed = () => {
        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition((position) => {
                map.setView({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }, zoom);
            });
    }

    const initializeMapView = () => {
        new L.TileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAP_BOX_API_KEY}`, {
            attribution: '<a href="https://www.github.com/sailing-yacht-research-foundation"><img src="https://syrf.io/wp-content/themes/syrf/assets/svg/icon-github.svg"></img></a>',
            maxZoom: 18,
            id: 'jweisbaum89/cki2dpc9a2s7919o8jqyh1gss',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'your.mapbox.access.token'
        }).addTo(map);
    }

    const attachRaceMarkersToMap = () => {
        races.forEach(race => {
            L.marker(race.latlng, {
                icon: L.divIcon({
                    html: ReactDOMServer.renderToString(<GiSailboat style={{ color: '#fff', fontSize: '35px' }} />),
                    iconSize: [20, 20],
                    className: 'myDivIcon'
                })
            })
            .addTo(map);
        });
    }

    return (
        <>
        </>
    );
}