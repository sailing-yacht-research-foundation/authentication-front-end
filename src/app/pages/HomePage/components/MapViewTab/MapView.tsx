import 'leaflet/dist/leaflet.css';

import React, { useEffect, useImperativeHandle } from 'react';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { GiSailboat } from 'react-icons/gi';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectMapResults } from '../../slice/selectors';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';

let markers: any[] = [];

const MAP_MOVE_TYPE = {
    immediately: 'immediately',
    animation: 'animation'
}

export const MapView = React.forwardRef<any, any>(({ zoom }, ref) => {

    const map = useMap();

    const history = useHistory();

    const results = useSelector(selectMapResults);

    const { t } = useTranslation();

    useEffect(() => {
        initializeMapView();
        if (results.length === 0) // no results and focus on user location
            zoomToCurrentUserLocationIfAllowed(MAP_MOVE_TYPE.immediately);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        attachRaceMarkersToMap();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [results]);

    useImperativeHandle(ref, () => ({
        zoomToCurrentUserLocationIfAllowed() {
            zoomToCurrentUserLocationIfAllowed(MAP_MOVE_TYPE.animation);
        }
    }));

    /**
     * Zoom to the location of current user
     * @param type should be either type: immediately or animation
     */
    const zoomToCurrentUserLocationIfAllowed = (type: string) => {
        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition((position) => {
                const params = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                type === MAP_MOVE_TYPE.animation ? map.flyTo(params, zoom) : map.setView(params, zoom);
            }, error => {
                _handleLocationPermissionError(error, type);
            });
    }

    const _handleLocationPermissionError = (error, type: string) => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                if (type === MAP_MOVE_TYPE.animation)
                    toast.error(t(translations.home_page.map_view_tab.please_share_your_location_to_use_this_feature))
                break;
        }
    }

    const initializeMapView = () => {
        new L.TileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAP_BOX_API_KEY}`, {
            attribution: '<a href="https://www.github.com/sailing-yacht-research-foundation"><img src="https://syrf.io/wp-content/themes/syrf/assets/svg/icon-github.svg"></img></a>',
            maxZoom: 18,
            minZoom: 2,
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
        });
        markers = [];

        results.forEach(race => {
            let marker = L.marker(L.latLng(race._source?.approx_start_point?.coordinates[1], race._source?.approx_start_point?.coordinates[0]), {
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
                    history.push(`/playback?raceid=${race._id}`);
                })
                .addTo(map);
            resultMarkers.push(marker);
            markers.push(marker);
        });

        if (resultMarkers.length > 0)
            map.fitBounds((new L.featureGroup(resultMarkers)).getBounds()); // zoom to the results location
    }

    const renderRacePopup = (race) => {
        return (
            <>
                <div>{t(translations.home_page.map_view_tab.name)} {race._source.name}</div>
                <div>{t(translations.home_page.map_view_tab.location)} {race._source.start_country}</div>
                <div>{t(translations.home_page.map_view_tab.date)} {moment(race._source.approx_start_time_ms).format('YYYY-MM-DD')}</div>
            </>
        )
    }

    return (
        <>
        </>
    );
})