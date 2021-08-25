import 'leaflet/dist/leaflet.css';
import "leaflet-draw/dist/leaflet.draw-src.css";

import React from 'react';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated } from 'app/pages/LoginPage/slice/selectors';
import { v4 as uuidv4 } from 'uuid';
import { Modal, Form } from 'antd';
import { SyrfFieldLabel, SyrfInputField } from 'app/components/SyrfForm';
import { useCourseSlice } from '../../slice';
import { selectCourseSequencedGeometries } from '../../slice/selectors';
import styled from 'styled-components';
import { FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

require('leaflet-draw');

type CourseGeometry = {
    geometryType: string;
    coordinates: any[][];
    properties: any;
    order: number;
    id: string;
};

const LAYER_TYPE = {
    marker: 'marker',
    polygon: 'polygon',
    polyline: 'polyline'
};

const GEOMETRY_TYPE = {
    point: 'Point',
    line: 'Polyline',
    polygon: 'Polygon'
};

export const MapView = () => {

    const map = useMap();

    const isAuthenticated = useSelector(selectIsAuthenticated);

    const layerOrder = React.useRef(1);

    const geometryName = React.useRef('');

    const [showGeometryNamePopup, setShowGeometryNamePopup] = React.useState<boolean>(false);

    const [geometryNameForm] = Form.useForm();

    const { actions } = useCourseSlice();

    const couseSequencedGeometries = useSelector(selectCourseSequencedGeometries);

    const mutableCouseSequencedGeometries = React.useRef<any[]>([]);

    const history = useHistory();

    const dispatch = useDispatch();

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

        let drawnItems = L.featureGroup().addTo(map);
        map.addControl(new L.Control.Draw({
            edit: {
                featureGroup: drawnItems,
                poly: {
                    allowIntersection: false
                }
            },
            draw: {
                rectangle: false,
                circle: false,
                circlemarker: false,
                polygon: {
                    allowIntersection: false,
                    showArea: true
                }
            }
        }));

        return drawnItems;
    }

    useEffect(() => {
        let drawnItems = initializeMapView();
        registerOnGeometryDrawStartEvent();
        registerOnGeometryCreatedEvent(drawnItems);
        registerOnSavedEvent();
        registerOnLayerDeletedEvent();
    }, []);

    const registerOnSavedEvent = () => {
        map.on(L.Draw.Event.EDITSTOP, function (e) {

        });
    }

    const registerOnLayerDeletedEvent = () => {
        map.on(L.Draw.Event.DELETED, function (e) {
            e.layers.eachLayer(layer => {
                mutableCouseSequencedGeometries.current.filter(geometry => {
                    return geometry.id !== layer.options._id;
                })
            });
            dispatch(actions.setCourseSequencedGeometries(mutableCouseSequencedGeometries.current));
        });
    }

    const registerOnGeometryDrawStartEvent = () => {
        map.on(L.Draw.Event.DRAWSTART, function (e) {
            setShowGeometryNamePopup(true);
        });
    }

    const registerOnGeometryCreatedEvent = (drawnItems) => {
        map.on(L.Draw.Event.CREATED, function (e) {
            let layerType = e.layerType,
                layer = e.layer,
                layerId = uuidv4(),
                geometry: CourseGeometry | any = {
                    id: layerId,
                    properties: {
                        name: geometryName.current
                    },
                    order: layerOrder.current,
                };

            switch (layerType) {
                case LAYER_TYPE.marker:
                    geometry.geometryType = GEOMETRY_TYPE.point;
                    geometry.coordinates = [
                        [layer.getLatLng().lat, layer.getLatLng().lng]
                    ];
                    layer.options._geometry_type = GEOMETRY_TYPE.point;
                    break;
                case LAYER_TYPE.polygon:
                    geometry.geometryType = GEOMETRY_TYPE.polygon;
                    geometry.coordinates = [layer.getLatLngs().map(function (point) {
                        return [point.lat, point.lng];
                    })];
                    layer.options._geometry_type = GEOMETRY_TYPE.polygon;
                    break;
                case LAYER_TYPE.polyline:
                    geometry.geometryType = GEOMETRY_TYPE.line;
                    geometry.coordinates = [layer.getLatLngs().map(function (point) {
                        return [point.lat, point.lng];
                    })];
                    layer.options._geometry_type = GEOMETRY_TYPE.line;
                    break;
            }

            layer.options._name = geometryName.current;
            layer.options._id = layerId;
            drawnItems.addLayer(layer);
            mutableCouseSequencedGeometries.current.push(geometry);
            dispatch(actions.setCourseSequencedGeometries(JSON.parse(JSON.stringify(mutableCouseSequencedGeometries.current))));
            layerOrder.current++;
        });
    }

    const submitAndsetMarketName = () => {
        geometryNameForm
            .validateFields()
            .then(values => {
                const { geometry_name } = values;
                geometryName.current = geometry_name;
                setShowGeometryNamePopup(false);
            })
            .catch(info => {
            });
    }

    const saveCourse = () => {
        if (couseSequencedGeometries.length === 0) {
            toast.error('You cannot save the course because You have not added any geometries');
        }

        if (!isAuthenticated) {
            history.push('/signin?redirect_back=courses/create');
            toast.error('Please signup to continue!');
        }
    }

    return (
        <>
            <Modal
                title={'Enter geometry name'}
                bodyStyle={{ display: 'flex', justifyContent: 'center', overflow: 'hidden' }}
                cancelButtonProps={{ style: { display: 'none' } }}
                onOk={submitAndsetMarketName}
                closable={false}
                keyboard={false}
                visible={showGeometryNamePopup}>
                <Form
                    form={geometryNameForm}
                    layout="vertical"
                    name="basic"
                    style={{ width: '100%' }}

                    initialValues={{
                        geometry_name: '',
                    }}
                >
                    <Form.Item
                        label={<SyrfFieldLabel>Geometry name</SyrfFieldLabel>}
                        name="geometry_name"
                        rules={[{ required: true }]}
                    >
                        <SyrfInputField
                            placeholder={'Input a name for this geometry'}
                        />
                    </Form.Item>
                </Form>

            </Modal>
            <SaveButton onClick={saveCourse} title={'Save course'}>
                <FaSave style={{color: '#fff'}}/>
            </SaveButton>
        </>
    );
}

const SaveButton = styled.div`
    position: absolute;
    top: 290px;
    left: 12px;
    width: 30px;
    height: 30px;
    z-index: 9999;
    background: #599DF9;
    display: flex;
    justify-content: center;
    align-items:center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.65);
    border-radius: 2px;
`;