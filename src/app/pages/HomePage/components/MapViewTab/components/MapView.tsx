import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import React, { useEffect, useImperativeHandle } from 'react';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { GoPrimitiveDot } from 'react-icons/go';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectResults, selectUpcomingRaces } from '../../../slice/selectors';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { checkIfLocationIsValid, renderEmptyValue } from 'utils/helpers';
import { TIME_FORMAT } from 'utils/constants';
import { getProfilePicture, getUserName } from 'utils/user-utils';
import { selectIsAuthenticated, selectUser } from 'app/pages/LoginPage/slice/selectors';

require('leaflet.markercluster');

let markerCluster, userMarker;

let markers: any[] = [];

const MAP_MOVE_TYPE = {
    immediately: 'immediately',
    animation: 'animation'
}

let geoLoc;

let watchID;

export const MapView = React.forwardRef<any, any>(({ zoom, isFocusingOnSearchInput }, ref) => {

    const map = useMap();

    const history = useHistory();

    const results = useSelector(selectResults);

    const upcomingRaceResults = useSelector(selectUpcomingRaces);

    const { t } = useTranslation();

    const user = useSelector(selectUser);

    const isAuthenticated = useSelector(selectIsAuthenticated);

    const [location, setLocation] = React.useState({
        lon: null,
        lat: null
    });

    useEffect(() => {
        initializeMapView();
        if (results.length === 0 || upcomingRaceResults.length === 0) // no results and focus on user location
            zoomToCurrentUserLocationIfAllowed(MAP_MOVE_TYPE.immediately);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        attachRaceMarkersToMap();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [results, upcomingRaceResults]);

    useEffect(() => {
        addUserMarkerToMap();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isAuthenticated, location]);

    useImperativeHandle(ref, () => ({
        zoomToCurrentUserLocationIfAllowed() {
            zoomToCurrentUserLocation(MAP_MOVE_TYPE.animation);
        }
    }));

    const zoomToCurrentUserLocation = (type: string) => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition((position) => {
            const params = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            type === MAP_MOVE_TYPE.animation ? map.flyTo(params, zoom) : map.setView(params, zoom);
        }, error => {
            _handleLocationPermissionError(error, type);
        }, { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true })
    }

    /**
     * Zoom to the location of current user
     * @param type should be either type: immediately or animation
     */
    const zoomToCurrentUserLocationIfAllowed = (type: string) => {
        if (!navigator.geolocation) return;

        geoLoc = navigator.geolocation;
        watchID = geoLoc.watchPosition((position) => {
            const params = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            if (type === MAP_MOVE_TYPE.animation) {
                map.flyTo(params, zoom);
            } else {
                map.setView(params, zoom);
                setLocation({ lon: params.lng, lat: params.lat });
            }
            geoLoc.clearWatch(watchID);
        }, error => {
            _handleLocationPermissionError(error, type);
        });
    }

    const addUserMarkerToMap = () => {
        if (userMarker) {
            map.removeLayer(userMarker);
        }

        if (user.firstName && isAuthenticated && checkIfLocationIsValid(location.lon, location.lat))
            userMarker = L.marker(L.latLng(location.lat, location.lon), {
                icon: L.divIcon({
                    html: ReactDOMServer.renderToString(<img alt={getUserName(user)} src={getProfilePicture(user)} className='avatar-img' />),
                    iconSize: [30, 30],
                    iconAnchor: [18, 0],
                })
            })
                .bindPopup(getUserName(user))
                .addTo(map);
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
            attribution: '<a href="https://www.github.com/sailing-yacht-research-foundation"><img style="width: 15px; height: 15px;" src="/favicon.ico"></img></a>',
            maxZoom: 18,
            minZoom: 2,
            id: 'jweisbaum89/cki2dpc9a2s7919o8jqyh1gss',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'your.mapbox.access.token',
        }).addTo(map);
    }

    const attachRaceMarkersToMap = () => {
        const resultMarkers: any[] = [];
        const resultItems = results.length > 0 ? results : upcomingRaceResults;

        if (markerCluster) {
            markerCluster.removeLayers(markers);
            map.removeLayer(markerCluster);
            markers.forEach((marker, index) => {
                map.removeLayer(marker);
            });
            markers = [];
        }

        markerCluster = L.markerClusterGroup();

        if (resultItems.length > 0 && geoLoc && watchID) geoLoc.clearWatch(watchID);

        resultItems.forEach(race => {
            const marker = createResultMarker(race);
            if (marker) {
                resultMarkers.push(marker);
                markers.push(marker);
            }
        });

        if (resultMarkers.length > 0) {
            markerCluster.addLayers(resultMarkers);
            map.addLayer(markerCluster);
            map.fitBounds((new L.featureGroup(resultMarkers)).getBounds()); // zoom to the results location
        }
    }

    const createResultMarker = (race) => {
        if (typeof race._source?.approx_start_point?.coordinates[1] === 'undefined') return; // not rendering result with no longlat.
        let marker = L.marker(L.latLng(race._source?.approx_start_point?.coordinates[1], race._source?.approx_start_point?.coordinates[0]), {
            icon: L.divIcon({
                html: ReactDOMServer.renderToString(<GoPrimitiveDot style={{ color: '#fff', fontSize: '35px' }} />),
                iconSize: [20, 20],
                iconAnchor: [18, 0],
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
                history.push(`/playback?raceId=${race._id}`);
            })
            .addTo(map);

        return marker;
    }

    React.useEffect(() => {
        if (isFocusingOnSearchInput && geoLoc && watchID) {
            geoLoc.clearWatch(watchID);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocusingOnSearchInput]);

    const renderRacePopup = (race) => {
        return (
            <>
                <div>{t(translations.home_page.map_view_tab.name)} {race._source.name}</div>
                {race._source.start_country && <div>{t(translations.home_page.map_view_tab.location)} {[race._source.start_city, race._source.start_country].filter(Boolean).join(', ')}</div>}
                <div>{t(translations.home_page.map_view_tab.date)} {moment(race._source.approx_start_time_ms).format(TIME_FORMAT.date_text)}</div>
                {race._source.event_name && <div>{t(translations.home_page.map_view_tab.event_name)} {renderEmptyValue(race._source.event_name)}</div>}
                {race._source.event_description && <div>{t(translations.home_page.map_view_tab.description)} {renderEmptyValue(race._source.event_description)}</div>}
                {race._source.start_city && <div>{t(translations.home_page.map_view_tab.city)} {renderEmptyValue(race._source.start_city)}</div>}
                {race._source.start_country && <div>{t(translations.home_page.map_view_tab.country)} {renderEmptyValue(race._source.start_country)}</div>}
            </>
        )
    }

    return (
        <>
        </>
    );
})