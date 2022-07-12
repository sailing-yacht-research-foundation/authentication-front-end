import React from 'react';
import * as L from 'leaflet';
import { useMap } from 'react-leaflet';
import { FaMapMarkerAlt } from 'react-icons/fa';
import ReactDOMServer from 'react-dom/server';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';

let marker;
let endMarker;

const options = {
    START: 'start',
    END: 'end'
}

export const Map = (props) => {

    const { onMapClicked, coordinates, endCoordinates, zoom, noMarkerInteraction, setFormChanged, option } = props;

    const { t } = useTranslation();

    const map = useMap();

    const selectedOption = React.useRef("start");

    const initMapClickEvent = () => {
        map.on('click', (e) => {
            const selectedOpt = selectedOption.current;
            onMapClicked(e.latlng.wrap().lat, e.latlng.wrap().lng, selectedOpt);

            if (selectedOpt === "start") setMarker(e.latlng);
            else setEndMarker(e.latlng);

            if (setFormChanged) {
                setFormChanged(true);
            }
        });
    }

    const setMarker = (coordinates) => {
        if (marker) map.removeLayer(marker);
        marker = new L.marker(coordinates, {
            icon: L.divIcon({
                html: ReactDOMServer.renderToString(<FaMapMarkerAlt style={{ color: '#FFF', fontSize: '35px' }} />),
                iconSize: [20, 20],
                iconAnchor: [18, 42],
                className: 'my-race',
                popupAnchor: [0, -45],
            })
        })
            .bindPopup(t(translations.general.start))
            .on("mouseover", function (e) {
                marker.openPopup();
            })
            .on("mouseout", function (e) {
                marker.closePopup();
            })
            .addTo(map);
    }

    const setEndMarker = (coordinates) => {
        if (endMarker) map.removeLayer(endMarker);
        endMarker = new L.marker(coordinates, {
            icon: L.divIcon({
                html: ReactDOMServer.renderToString(<FaMapMarkerAlt style={{ color: '#f1c40f', fontSize: '35px' }} />),
                iconSize: [20, 20],
                iconAnchor: [18, 42],
                className: 'my-race',
                popupAnchor: [0, -45],
            })
        })
            .bindPopup(t(translations.general.end))
            .on("mouseover", function (e) {
                endMarker.openPopup();
            })
            .on("mouseout", function () {
                endMarker.closePopup();
            })
            .addTo(map);
    }

    const removeEndMarker = () => {
        if (endMarker) map.removeLayer(endMarker);
        endMarker = undefined;
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
        map.setView(coordinates, map.getZoom());
        setMarker(coordinates);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [coordinates]);

    React.useEffect(() => {
        if (endCoordinates) {
            map.setView(endCoordinates,  map.getZoom());
            setEndMarker(endCoordinates);
        } else {
            removeEndMarker();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endCoordinates])

    React.useEffect(() => {
        initializeMapView();
        if (!noMarkerInteraction)
            initMapClickEvent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        selectedOption.current = option;
        if (option === options.START && coordinates) {
            map.setView(coordinates,  map.getZoom());
        } else if (option === options.END && endCoordinates) {
            map.setView(endCoordinates,  map.getZoom());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [option])

    return (
        <>
        </>
    )
}