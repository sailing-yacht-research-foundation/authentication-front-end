import React from 'react';
import * as L from 'leaflet';
import { useMap } from 'react-leaflet';
import { addNonGroupLayers } from 'utils/helpers';
import { mapInitializationParams } from 'utils/constants';

require('leaflet-draw');

let drawControlFull;
let drawControlEditOnly;
let drawnItems;

export const Map = (props) => {

    const { onCoordinatesRecevied, coordinates, userCoordinates } = props;

    const [inititalizedPolygon, setInitializedPolygon] = React.useState<boolean>(false);

    const map = useMap();
    
    React.useEffect(() => {
        initPolygonShapeOnCompetitionUnitUpdate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [coordinates]);

    React.useEffect(() => {
        if (!coordinates || coordinates.length === 0) {
            map.setView(userCoordinates, map.getZoom());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userCoordinates]);

    const initPolygonShapeOnCompetitionUnitUpdate = () => {
        if (coordinates.length > 0 && !inititalizedPolygon) {
            setInitializedPolygon(true);
            let geoJsonGroup = L.polygon(coordinates).addTo(map);
            addNonGroupLayers(geoJsonGroup, drawnItems);
            map.setView({
                lat: coordinates[0][0][0],
                lng: coordinates[0][0][1]
            }, map.getZoom());
            drawControlEditOnly.addTo(map);
            drawControlFull.remove(map);
        }
    }

    const initializeMapView = () => {
        new L.TileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAP_BOX_API_KEY}`, mapInitializationParams).addTo(map);

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

    React.useEffect(() => {
        initializeMapView();
        registerOnSavedEvent();
        registerOnLayerDeletedEvent();
        registerOnGeometryCreatedEvent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
        </>
    )
}
