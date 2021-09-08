import 'leaflet/dist/leaflet.css';
import "leaflet-draw/dist/leaflet.draw-src.css";

import React from 'react';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { Modal, Form, Button } from 'antd';
import { SyrfFieldLabel, SyrfInputField } from 'app/components/SyrfForm';
import { useCourseSlice } from '../../slice';
import { selectCourseSequencedGeometries } from '../../slice/selectors';
import styled from 'styled-components';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { create, getById, updateCourseGeometry } from 'services/live-data-server/courses';
import { addNonGroupLayers } from 'utils/helpers';
import ReactDOMServer from 'react-dom/server';
import { HiSave } from 'react-icons/hi';
import { IoIosArrowBack } from 'react-icons/io';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';

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

const MODE = {
    CREATE: 'create',
    UPDATE: 'update'
};

export const MapView = () => {

    const map = useMap();

    const layerOrder = React.useRef(1);

    const geometryName = React.useRef('');

    const [showGeometryNamePopup, setShowGeometryNamePopup] = React.useState<boolean>(false);

    const [geometryNameForm] = Form.useForm();

    const { actions } = useCourseSlice();

    const couseSequencedGeometries = useSelector(selectCourseSequencedGeometries);

    const mutableCouseSequencedGeometries = React.useRef<any[]>([]);

    const history = useHistory();

    const location = useLocation();

    const dispatch = useDispatch();

    const [mode, setMode] = React.useState<string>(MODE.CREATE);

    const { competitionUnitId, courseId } = useParams<{ competitionUnitId: string, courseId: string }>();

    const { t } = useTranslation();

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

        const drawnItems = L.featureGroup().addTo(map);
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
                },
                marker: {
                    icon: L.divIcon({
                        html: ReactDOMServer.renderToString(<FaMapMarkerAlt style={{ color: '#fff', fontSize: '35px' }} />),
                        iconSize: [20, 20],
                        className: 'my-race'
                    })
                }
            }
        }));

        return drawnItems;
    }

    useEffect(() => {
        const drawnItems = initializeMapView();
        registerOnGeometryDrawStartEvent();
        registerOnGeometryCreatedEvent(drawnItems);
        registerOnLayersDeletedEvent();
        registerOnLayersEdittedEvent();
        initModeAndData(drawnItems);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const initModeAndData = async (drawnItems) => {
        if (location.pathname.includes(MODE.UPDATE)) {
            setMode(MODE.UPDATE);

            const response = await getById(courseId);

            if (response.success) {
                const courseSequencedGeometriesData = response.data?.courseSequencedGeometries;
                if (courseSequencedGeometriesData.length > 0) {
                    mutableCouseSequencedGeometries.current = courseSequencedGeometriesData;
                    dispatch(actions.setCourseSequencedGeometries(courseSequencedGeometriesData));
                    drawGeometries(courseSequencedGeometriesData, drawnItems);
                }
            } else {
                history.push('/404');
            }
        }
    }

    const drawGeometries = (courseSequencedGeometriesData, drawnItems) => {
        let coordinates;
        courseSequencedGeometriesData.forEach(geometry => {
            let geoJsonGroup;

            switch (geometry.geometryType) {
                case GEOMETRY_TYPE.line:
                    geoJsonGroup = L.polyline(geometry.coordinates).addTo(map);
                    coordinates = geometry.coordinates[0][0];
                    geoJsonGroup.options._geometry_type = GEOMETRY_TYPE.line;
                    break;
                case GEOMETRY_TYPE.point:
                    geoJsonGroup = L.marker(geometry.coordinates[0], {
                        icon: L.divIcon({
                            html: ReactDOMServer.renderToString(<FaMapMarkerAlt style={{ color: '#fff', fontSize: '35px' }} />),
                            iconSize: [20, 20],
                            className: 'my-race'
                        })
                    }).addTo(map);
                    coordinates = geometry.coordinates[0];
                    geoJsonGroup.options._geometry_type = GEOMETRY_TYPE.point;
                    break;
                case GEOMETRY_TYPE.polygon:
                    geoJsonGroup = L.polygon(geometry.coordinates).addTo(map);
                    coordinates = geometry.coordinates[0][0];
                    geoJsonGroup.options._geometry_type = GEOMETRY_TYPE.polygon;
                    break;
            }

            geoJsonGroup.options._id = geometry.id;
            geoJsonGroup.options._name = geometry.properties.name;
            addNonGroupLayers(geoJsonGroup, drawnItems);

            map.setView(coordinates, 13);
        })
    }

    const registerOnLayersDeletedEvent = () => {
        map.on(L.Draw.Event.DELETED, function (e) {
            e.layers.eachLayer(layer => {
                mutableCouseSequencedGeometries.current = mutableCouseSequencedGeometries.current.filter(geometry => {
                    return geometry.id !== layer.options._id;
                });
            });
            dispatch(actions.setCourseSequencedGeometries(mutableCouseSequencedGeometries.current));
        });
    }

    const registerOnGeometryDrawStartEvent = () => {
        map.on(L.Draw.Event.DRAWSTART, function (e) {
            setShowGeometryNamePopup(true);
            geometryNameForm.resetFields();
        });
    }

    const registerOnLayersEdittedEvent = () => {
        map.on(L.Draw.Event.EDITED, function (e) {
            const layers = e.layers;
            layers.eachLayer(layer => {
                let geometry = mutableCouseSequencedGeometries.current.filter(geometry => {
                    return geometry.id === layer.options._id;
                })[0];
                mutableCouseSequencedGeometries.current = mutableCouseSequencedGeometries.current.filter(geometry => {
                    return geometry.id !== layer.options._id;
                });
                switch (layer.options._geometry_type) {
                    case LAYER_TYPE.marker:
                        geometry.coordinates = [
                            [layer.getLatLng().lat, layer.getLatLng().lng]
                        ];
                        break;
                    case LAYER_TYPE.polygon:
                        geometry.coordinates = layer.getLatLngs().map(points => {
                            return points.map(point => {
                                return [point.lat, point.lng];
                            });
                        });
                        break;
                    case LAYER_TYPE.polyline:
                        geometry.coordinates = [layer.getLatLngs().map(function (point) {
                            return [point.lat, point.lng];
                        })];
                        break;
                }
                mutableCouseSequencedGeometries.current.push(geometry);
            });
            dispatch(actions.setCourseSequencedGeometries(mutableCouseSequencedGeometries.current));
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
                    geometry.coordinates = layer.getLatLngs().map(points => {
                        return points.map(point => {
                            return [point.lat, point.lng];
                        });
                    });
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
            mutableCouseSequencedGeometries.current = [...mutableCouseSequencedGeometries.current, geometry];
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

    const saveCourse = async () => {
        if (couseSequencedGeometries.length === 0) {
            toast.error(t(translations.course_create_update_page.you_cannot_create_course));
        }
        else {
            let response;
            toast.info(t(translations.course_create_update_page.saving));

            if (mode === MODE.CREATE)
                response = await create(competitionUnitId, couseSequencedGeometries);
            else
                response = await updateCourseGeometry(courseId, couseSequencedGeometries);

            if (response.success) {
                toast.success(t(translations.course_create_update_page.successfully_created_your_course));
                setMode(MODE.UPDATE);
            } else {
                toast.error(t(translations.course_create_update_page.an_unexpected_error));
            }

            history.push(`/competition-units/${competitionUnitId}/courses/${response.data?.id}/update`);
        }
    }

    return (
        <>
            <Modal
                title={t(translations.course_create_update_page.enter_geometry_name)}
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
                        label={<SyrfFieldLabel>{t(translations.course_create_update_page.geometry_name)}</SyrfFieldLabel>}
                        name="geometry_name"
                        rules={[{ required: true }]}
                    >
                        <SyrfInputField
                            placeholder={t(translations.course_create_update_page.input_a_name_for_this_geometry)}
                        />
                    </Form.Item>
                </Form>

            </Modal>
            {history.action !== 'POP' && <CancelButton icon={<IoIosArrowBack
                style={{ marginRight: '5px' }}
                size={18} />} onClick={() => history.goBack()}>
                {t(translations.course_create_update_page.cancel)}
            </CancelButton>}
            <SaveButton icon={<HiSave
                style={{ marginRight: '5px' }}
                size={18} />} type="primary" onClick={saveCourse}>
                {t(translations.course_create_update_page.save)}
            </SaveButton>
        </>
    );
}

const SaveButton = styled(Button)`
    position: absolute;
    top: 20px;
    right: 50px;
    transform: translateX(50%);
    z-index: 9999;
    border-radius: 5px;
    width: 90;
`;

const CancelButton = styled(Button)`
    position: absolute;
    top: 20px;
    right: 150px;
    transform: translateX(50%);
    z-index: 9999;
    border-radius: 5px;
    width: 90px;
`;