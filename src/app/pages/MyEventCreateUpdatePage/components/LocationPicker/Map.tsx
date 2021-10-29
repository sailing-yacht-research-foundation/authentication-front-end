import React from 'react';
import * as L from 'leaflet';
import { useMap } from 'react-leaflet';
import { FaMapMarkerAlt } from 'react-icons/fa';
import ReactDOMServer from 'react-dom/server';

let marker;

export const Map = (props) => {

    const { onMapClicked, coordinates, zoom, noMarkerInteraction, setFormChanged } = props;

    const map = useMap();

    const initMapClickEvent = () => {
        map.on('click', (e) => {
            onMapClicked(e.latlng.wrap().lat, e.latlng.wrap().lng);
            setMarker(e.latlng);
            if (setFormChanged) {
                setFormChanged(true);
            }
        });
    }

    const setMarker = (coordinates) => {
        if (marker) map.removeLayer(marker);
        marker = new L.marker(coordinates, {
            icon: L.divIcon({
                html: ReactDOMServer.renderToString(<FaMapMarkerAlt style={{ color: '#fff', fontSize: '35px' }} />),
                iconSize: [20, 20],
                iconAnchor: [18, 42],
                className: 'my-race'
            })
        }).addTo(map);
    }

    const initializeMapView = () => {
        new L.TileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAP_BOX_API_KEY}`, {
            attribution: '<a href="https://www.github.com/sailing-yacht-research-foundation"><img style="width: 15px; height: 15px;" src="/favicon.ico"></img></a>',
            maxZoom: 18,
            minZoom: zoom || 1,
            id: 'jweisbaum89/cki2dpc9a2s7919o8jqyh1gss',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'your.mapbox.access.token'
        }).addTo(map);

        setMarker(coordinates);
    }

    React.useEffect(() => {
        map.setView(coordinates, 10);
        setMarker(coordinates);
        onMapClicked(coordinates.lat, coordinates.lng);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [coordinates]);

    React.useEffect(() => {
        initializeMapView();
        if (!noMarkerInteraction)
            initMapClickEvent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
        </>
    )
}