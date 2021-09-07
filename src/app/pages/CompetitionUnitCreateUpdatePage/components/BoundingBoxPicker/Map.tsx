import React from 'react';
import * as L from 'leaflet';
import { useMap } from 'react-leaflet';

require('leaflet-draw');

let drawControlFull;
let drawControlEditOnly;
let drawnItems;

export const Map = (props) => {

    const { onCoordinatesRecevied, coordinates } = props;

    const [inititalizedPolygon, setInitializedPolygon] = React.useState<boolean>(false);

    const map = useMap();

    React.useEffect(() => {
        initPolygonShapeOnCompetitionUnitUpdate();
    }, [coordinates]);

    const initPolygonShapeOnCompetitionUnitUpdate = () => {
        if (coordinates.length > 0 && !inititalizedPolygon) {
            setInitializedPolygon(true);
            let geoJsonGroup = L.polygon(coordinates).addTo(map);
            addNonGroupLayers(geoJsonGroup, drawnItems);
            map.setView({
                lat: coordinates[0][0][0],
                lng: coordinates[0][0][1]
            }, 10);
            drawControlEditOnly.addTo(map);
            drawControlFull.remove(map);
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

        drawnItems = L.featureGroup().addTo(map);
        drawControlFull = new L.Control.Draw({
            edit: {
                featureGroup: drawnItems,
                poly: {
                    allowIntersection: false
                }
            },
            draw: {
                polyline: false,
                rectangle: false,
                circle: false,
                circlemarker: false,
                polygon: {
                    allowIntersection: false,
                    showArea: true
                },
                marker: false
            }
        });
        drawControlEditOnly = new L.Control.Draw({
            edit: {
                featureGroup: drawnItems
            },
            draw: false
        });
        map.addControl(drawControlFull);
    }

    const registerOnSavedEvent = () => {
        map.on(L.Draw.Event.EDITED, function (e) {
            const layers = e.layers;
            layers.eachLayer(layer => {
                onCoordinatesRecevied(layer.getLatLngs().map(points => {
                    return points.map(point => {
                        return [point.lat, point.lng];
                    });
                }));
            });
        });
    }

    const registerOnLayerDeletedEvent = () => {
        map.on(L.Draw.Event.DELETED, function (e) {
            onCoordinatesRecevied([]);
            if (drawnItems.getLayers().length === 0) {
                drawControlEditOnly.remove(map);
                drawControlFull.addTo(map);
            };
        });
    }

    const registerOnGeometryCreatedEvent = () => {
        map.on(L.Draw.Event.CREATED, function (e) {
            let layer = e.layer;
            onCoordinatesRecevied(layer.getLatLngs().map(points => {
                return points.map(point => {
                    return [point.lat, point.lng];
                });
            }));
            drawnItems.addLayer(layer);
            drawControlFull.remove(map);
            drawControlEditOnly.addTo(map)
        });
    }

    const addNonGroupLayers = (sourceLayer, targetGroup) => {
        if (sourceLayer instanceof L.LayerGroup) {
            sourceLayer.eachLayer(function (layer) {
                addNonGroupLayers(layer, targetGroup);
            });
        } else {
            targetGroup.addLayer(sourceLayer);
        }
    }

    React.useEffect(() => {
        initializeMapView();
        registerOnSavedEvent();
        registerOnLayerDeletedEvent();
        registerOnGeometryCreatedEvent();
    }, []);

    return (
        <>
        </>
    )
}