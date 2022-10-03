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
import { depthAreaChartOptions, mapInitializationParams, TIME_FORMAT } from 'utils/constants';
import { useSelector } from 'react-redux';
import { selectPagination } from '../slice/selectors';

import { LeafletLayer } from 'deck.gl-leaflet';
import { MVTLayer } from '@deck.gl/geo-layers';
import { NauticalChartSelector } from 'app/components/NauticalChartSelector';

require('leaflet.markercluster');

let markerCluster;

let markers: any[] = [];

const MAP_MOVE_TYPE = {
    immediately: 'immediately',
    animation: 'animation'
}

let geoLoc;
let watchID;
const deckLayer = new LeafletLayer({
    layers: []
});

export const MyTrackMap = React.forwardRef<any, any>(({ zoom, isFocusingOnSearchInput }, ref) => {

    const [layers, setLayers] = React.useState<any>([new MVTLayer(depthAreaChartOptions)]);

    const map = useMap();

    const [results, setResults] = useState<any>([]);

    const pagination = useSelector(selectPagination);

    const { t } = useTranslation();

    useEffect(() => {
        initializeMapView();
        if (results.length === 0) // no results and focus on user location
            zoomToCurrentUserLocationIfAllowed(MAP_MOVE_TYPE.immediately);

        return () => {
            deckLayer.setProps({ layers: [] });
            map.removeLayer(deckLayer);
        }
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
                    toast.error(t(translations.home_page.please_share_your_location_to_use_this_feature))
                break;
        }
    }

    const initializeMapView = () => {
        new L.TileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAP_BOX_API_KEY}`, mapInitializationParams).addTo(map);
        map.addLayer(deckLayer);
        deckLayer?.setProps({ layers: layers });
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
                window.open(`/playback?raceId=${race.id}${race.track?.id ? `&trackId=${race.track?.id}` : ''}${race.track?.endTime ? `&startTime=${race.track.startTime}&endTime=${race.track.endTime}` : ''}`);
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

    React.useEffect(() => {
        const list = pagination.rows;
        const listData = list.map((data) => {
            const competitionUnit = data.competitionUnit;
            return {
                ...competitionUnit,
                event: data.event,
                track: data?.trackJson
            };
        });

        setResults(listData);
    }, [pagination]);

    const renderRacePopup = (race) => {
        return (
            <>
                {
                    race.event.isPrivate ? (<div>{t(translations.home_page.name)} {race.name}</div>) :
                        (<div>{t(translations.home_page.name)} {[race.event?.name, race.name].filter(Boolean).join(' - ')}</div>)
                }
                <div>{t(translations.home_page.date)} {moment(race.approximateStart).format(TIME_FORMAT.date_text)}</div>
                {race.description && <div>{t(translations.home_page.description)} {renderEmptyValue(race.description)}</div>}
                {race.city && <div>{t(translations.home_page.city)} {renderEmptyValue(race.city)}</div>}
                {race.country && <div>{t(translations.home_page.country)} {renderEmptyValue(race.country)}</div>}
            </>
        )
    }

    return (
        <NauticalChartSelector layers={layers} deckLayer={deckLayer} setLayers={setLayers} />
    );
})
