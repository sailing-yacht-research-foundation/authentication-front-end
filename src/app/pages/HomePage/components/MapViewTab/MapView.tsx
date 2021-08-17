import 'leaflet/dist/leaflet.css';

import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { GiSailboat } from 'react-icons/gi';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectResults } from '../../slice/selectors';
import moment from 'moment';

const markers: any[] = [];

export const MapView = (props) => {

    const { zoom } = props;

    const map = useMap();

    const history = useHistory();

    const results = useSelector(selectResults);

    useEffect(() => {
        initializeMapView();
        zoomToCurrentUserLocationIfAllowed();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (results.length > 0)
            attachRaceMarkersToMap();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [results]);

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
        const resultMarkers: any[] = [];

        markers.forEach((marker, index) => {
            map.removeLayer(marker);
            markers.splice(index, 1);
        });

        results.forEach(race => {
            let marker = L.marker(L.latLng(race.lat, race.lon), {
                icon: L.divIcon({
                    html: ReactDOMServer.renderToString(<GiSailboat style={{ color: '#fff', fontSize: '35px' }} />),
                    iconSize: [20, 20],
                    className: 'my-race'
                })
            })
                .bindPopup(ReactDOMServer.renderToString(renderRacePopup(race)))
                .on('mouseover', () => {
                    marker.openPopup();
                })
                .on('mouseout', () => {
                    marker.closePopup();
                })
                .on('click', () => {
                    history.push(`/playback?raceid=${race.id}`);
                })
                .addTo(map);
            resultMarkers.push(marker);
            markers.push(marker);
        });

        map.fitBounds((new L.featureGroup(resultMarkers)).getBounds()); // zoom to the results location
    }

    const renderRacePopup = (race) => {
        return (
            <>
                <div>Name: {race.name}</div>
                <div>Location: {race.locationName}</div>
                <div>Date: {moment(race.approximateStartTime).format('YYYY-MM-DD')}</div>
            </>
        )
    }

    return (
        <>
        </>
    );
}