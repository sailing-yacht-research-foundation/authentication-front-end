import React from 'react';
import * as L from 'leaflet';
import { useMap } from 'react-leaflet';
import { FaMapMarkerAlt } from 'react-icons/fa';
import ReactDOMServer from 'react-dom/server';

let marker;

export const Map = (props) => {

    const { onMapClicked, coordinates } = props;

    const map = useMap();

    const initMapClickEvent = () => {
        map.on('click', (e) => {
            onMapClicked(e.latlng.lat, e.latlng.lng);
            setMarker(e.latlng);
        });
    }

    const setMarker = (coordinates) => {
        if (marker) map.removeLayer(marker);
            marker = new L.marker(coordinates, {
                icon: L.divIcon({
                    html: ReactDOMServer.renderToString(<FaMapMarkerAlt style={{ color: '#fff', fontSize: '35px' }} />),
                    iconSize: [20, 20],
                    className: 'my-race'
                })
            }).addTo(map);
    }

    const initializeMapView = () => {
        new L.TileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAP_BOX_API_KEY}`, {
            attribution: '<a href="https://www.github.com/sailing-yacht-research-foundation"><img src="https://syrf.io/wp-content/themes/syrf/assets/svg/icon-github.svg"></img></a>',
            maxZoom: 18,
            minZoom: 1,
            id: 'jweisbaum89/cki2dpc9a2s7919o8jqyh1gss',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'your.mapbox.access.token'
        }).addTo(map);

        setMarker(coordinates);
    }

    React.useEffect(() => {
        initializeMapView();
        initMapClickEvent();
    }, []);
    
    return (
        <>
        </>
    )
}