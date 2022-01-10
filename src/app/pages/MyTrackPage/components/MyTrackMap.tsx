import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import React, { useEffect, useImperativeHandle, useState } from 'react';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { GoPrimitiveDot } from 'react-icons/go';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { renderEmptyValue } from 'utils/helpers';
import { TIME_FORMAT } from 'utils/constants';
import { getAllTracks } from 'services/live-data-server/my-tracks';

require('leaflet.markercluster');

let markerCluster;

let markers: any[] = [];

const MAP_MOVE_TYPE = {
    immediately: 'immediately',
    animation: 'animation'
}

let geoLoc;

let watchID;

export const MyTrackMap = React.forwardRef<any, any>(({ zoom, isFocusingOnSearchInput }, ref) => {

    const map = useMap();

    const [results, setResults] = useState<any>([]);

    const { t } = useTranslation();

    useEffect(() => {
        initializeMapView();
        getAll();
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
            zoomToCurrentUserLocation(MAP_MOVE_TYPE.animation);
        }
    }));

    const getAll = async () => {
        const response = await getAllTracks(1, 1000000);
        if (response.success) {
            const list = response?.data?.rows;
            const listData = list.map((data) => {
                const competitionUnit = data.competitionUnit;
                return {
                    ...competitionUnit,
                    event: data.event
                };
            });

            setResults(listData);
        }
    };

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

            type === MAP_MOVE_TYPE.animation ? map.flyTo(params, zoom) : map.setView(params, zoom);
            geoLoc.clearWatch(watchID);
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
            attribution: '<a href="https://www.github.com/sailing-yacht-research-foundation"><img style="width: 15px; height: 15px;" src="/favicon.ico"></img></a>',
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

        if (markerCluster) {
            markerCluster.removeLayers(markers);
            map.removeLayer(markerCluster);
            markers.forEach((marker, index) => {
                map.removeLayer(marker);
            });
            markers = [];
        }

        markerCluster = L.markerClusterGroup();

        if (results.length > 0 && geoLoc && watchID) geoLoc.clearWatch(watchID);

        results.forEach(race => {
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
        if (!race) return;
        if (typeof race.approximateStartLocation?.coordinates[1] === 'undefined') return; // not rendering result with no longlat.
        let marker = L.marker(L.latLng(race.approximateStartLocation?.coordinates[1], race.approximateStartLocation?.coordinates[0]), {
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
                window.open(`/playback?raceId=${race.id}`);
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
                {
                    race.event.isPrivate ? (<div>{t(translations.home_page.map_view_tab.name)} {race.name}</div>) :
                        (<div>{t(translations.home_page.map_view_tab.name)} {[race.event?.name, race.name].filter(Boolean).join(' - ')}</div>)
                }
                <div>{t(translations.home_page.map_view_tab.date)} {moment(race.approximateStart).format(TIME_FORMAT.date_text)}</div>
                {race.description && <div>{t(translations.home_page.map_view_tab.description)} {renderEmptyValue(race.description)}</div>}
                {race.city && <div>{t(translations.home_page.map_view_tab.city)} {renderEmptyValue(race.city)}</div>}
                {race.country && <div>{t(translations.home_page.map_view_tab.country)} {renderEmptyValue(race.country)}</div>}
            </>
        )
    }

    return (
        <>
        </>
    );
})