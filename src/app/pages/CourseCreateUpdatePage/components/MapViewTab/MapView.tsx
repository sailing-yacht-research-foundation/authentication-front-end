import 'leaflet/dist/leaflet.css';
import "leaflet-draw/dist/leaflet.draw-src.css";

import React from 'react';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { Modal, Form, message } from 'antd';
import { SyrfFieldLabel, SyrfInputField } from 'app/components/SyrfForm';
import { useCourseSlice } from '../../slice';
import { selectCourseSequencedGeometries } from '../../slice/selectors';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { create, getById, update } from 'services/live-data-server/courses';
import { addNonGroupLayers } from 'utils/helpers';
import ReactDOMServer from 'react-dom/server';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { CourseDeleteModal } from '../CourseDeleteModal';
import { MODE } from 'utils/constants';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';

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

L.drawLocal.draw.toolbar.buttons = {
    polyline: i18next.t(translations.course_create_update_page.draw_buttons.polyline),
    polygon: i18next.t(translations.course_create_update_page.draw_buttons.polygon),
    rectangle: i18next.t(translations.course_create_update_page.draw_buttons.rectangle),
    circle: i18next.t(translations.course_create_update_page.draw_buttons.circle),
    marker: i18next.t(translations.course_create_update_page.draw_buttons.marker),
    circlemarker: i18next.t(translations.course_create_update_page.draw_buttons.circlemarker)
};

let drawControl;

const defaultPolylineNames = ['Start/Finish', 'Start', 'Finish', 'Windward Gate', 'Leeward Gate'];

const defaultPolygonNames = ['Course Boundary', 'Exclusion Area', 'Starting Area'];

const defaultMarkerNames = ['Windward Mark', 'Leeward Mark', 'Offset'];

export const MapView = React.forwardRef((props, ref) => {

    const map = useMap();

    const layerOrder = React.useRef(1);

    const geometryName = React.useRef('');

    const [showGeometryNamePopup, setShowGeometryNamePopup] = React.useState<boolean>(false);

    const [showCourseNamePopup, setShowCourseNamePopup] = React.useState<boolean>(false);

    const [geometryNameForm] = Form.useForm();

    const [courseNameForm] = Form.useForm();

    const { actions } = useCourseSlice();

    const couseSequencedGeometries = useSelector(selectCourseSequencedGeometries);

    const mutableCouseSequencedGeometries = React.useRef<any[]>([]);

    const history = useHistory();

    const location = useLocation();

    const dispatch = useDispatch();

    const [mode, setMode] = React.useState<string>(MODE.CREATE);

    const { eventId, courseId } = useParams<{ eventId: string, courseId: string }>();

    const [course, setCourse] = React.useState<any>({});

    const { t } = useTranslation();

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [drawMode, setDrawMode] = React.useState<string>('');

    const [editingLayerId, setEditingLayerId] = React.useState<string | any>('');

    React.useImperativeHandle(ref, () => ({
        saveCourse() {
            setShowCourseNamePopup(true);
        },
        deleteCourse() {
            setShowDeleteModal(true);
        },
        goBack() {
            goBack();
        }
    }));

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

        const drawnItems = L.featureGroup().addTo(map);
        drawControl = new L.Control.Draw({
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
                        iconAnchor: [18, 42],
                        className: 'my-race'
                    })
                }
            }
        });
        map.addControl(drawControl);

        return drawnItems;
    }

    useEffect(() => {
        const drawnItems = initializeMapView();
        registerOnGeometryDrawStartEvent();
        registerOnGeometryCreatedEvent(drawnItems);
        registerOnLayersDeletedEvent();
        registerOnLayersEdittedEvent();
        registerOnGeometryEditStart();
        initModeAndData(drawnItems);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const initModeAndData = async (drawnItems) => {
        if (location.pathname.includes(MODE.UPDATE)) {
            setMode(MODE.UPDATE);

            const response = await getById(courseId);

            if (response.success) {
                setCourse(response.data);
                courseNameForm.setFieldsValue({ course_name: response.data.name });
                const courseSequencedGeometriesData = response.data?.courseSequencedGeometries;
                if (courseSequencedGeometriesData.length > 0) {
                    mutableCouseSequencedGeometries.current = courseSequencedGeometriesData;
                    dispatch(actions.setCourseSequencedGeometries(courseSequencedGeometriesData));
                    drawGeometries(courseSequencedGeometriesData, drawnItems);
                }
            } else {
                history.push(`/events/${eventId}`);
                message.error(t(translations.course_create_update_page.course_not_found));
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
                    if (geometry.coordinates[0]?.length > 0 && Array.isArray(geometry.coordinates[0][0])) {
                        coordinates = geometry.coordinates[0][0];
                    } else {
                        coordinates = geometry.coordinates[0];
                    }
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
                    if (geometry.coordinates[0]?.length > 0 && Array.isArray(geometry.coordinates[0][0])) {
                        coordinates = geometry.coordinates[0][0];
                    } else {
                        coordinates = geometry.coordinates[0];
                    }
                    geoJsonGroup.options._geometry_type = GEOMETRY_TYPE.polygon;
                    break;
            }

            geoJsonGroup.options._id = geometry.id;
            geoJsonGroup.options._name = geometry.properties.name;
            registerLayerNameAndTooltipClickEvent(geoJsonGroup);
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
            setDrawMode(e.layerType);
            geometryNameForm.resetFields();
        });
    }

    const registerOnGeometryEditStart = () => {
        map.on(L.Draw.Event.EDITSTART, function (e) {
            removeAllLayerToolTip();
        });
    }

    const removeAllLayerToolTip = () => {
        map.eachLayer(function (layer) {
            if (layer.options && layer.options._id) {
                layer.unbindTooltip();
            }
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
                if (geometry) {
                    geometry = JSON.parse(JSON.stringify(geometry));
                    switch (layer.options._geometry_type) {
                        case GEOMETRY_TYPE.point:
                            geometry.coordinates = [
                                [layer.getLatLng().lat, layer.getLatLng().lng]
                            ];
                            break;
                        case GEOMETRY_TYPE.polygon:
                            geometry.coordinates = layer.getLatLngs().map(points => {
                                return points.map(point => {
                                    return [point.lat, point.lng];
                                });
                            });
                            break;
                        case GEOMETRY_TYPE.line:
                            geometry.coordinates = layer.getLatLngs().map(function (points) {
                                if (points.map)
                                    return points.map(function (point) {
                                        return [point.lat, point.lng];
                                    });

                                return [points.lat, points.lng];
                            });
                            break;
                    }
                    mutableCouseSequencedGeometries.current.push(geometry);
                }
                registerLayerNameAndTooltipClickEvent(layer);
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
                    geometry.coordinates = geometry.coordinates[0];
                    layer.options._geometry_type = GEOMETRY_TYPE.polygon;
                    break;
                case LAYER_TYPE.polyline:
                    geometry.geometryType = GEOMETRY_TYPE.line;
                    geometry.coordinates = layer.getLatLngs().map(function (point) {
                        return [point.lat, point.lng];
                    });
                    layer.options._geometry_type = GEOMETRY_TYPE.line;
                    break;
            }

            layer.options._name = geometryName.current;
            layer.options._id = layerId;

            registerLayerNameAndTooltipClickEvent(layer);
            drawnItems.addLayer(layer);
            mutableCouseSequencedGeometries.current = [...mutableCouseSequencedGeometries.current, geometry];
            dispatch(actions.setCourseSequencedGeometries(JSON.parse(JSON.stringify(mutableCouseSequencedGeometries.current))));
            layerOrder.current++;
        });
    }

    const registerLayerNameAndTooltipClickEvent = (layer) => {
        let tooltip: HTMLDivElement = document.createElement("div");
        tooltip.setAttribute('_id', layer.options._id);
        tooltip.innerText = layer.options._name;
        tooltip.onclick = function (event) {
            const target = event.target as HTMLDivElement;
            const layerId = target.getAttribute('_id');
            const targetLayer = getLayerBasedOnId(layerId);

            if (targetLayer) {
                geometryNameForm.setFieldsValue({ geometry_name: layer.options._name });
                setEditingLayerId(layerId);
                setShowGeometryNamePopup(true);
            }
        }
        layer.bindTooltip(tooltip, { 'permanent': true, 'interactive': true });
    }

    const getLayerBasedOnId = (layerId) => {
        let targetLayer = null;
        map.eachLayer(function (layer) {
            if (layer.options && layer.options._id) {
                if (layer.options._id === layerId) {
                    targetLayer = layer;
                }
            }
        });

        return targetLayer;
    }

    const submitAndSetMarkerName = () => {
        geometryNameForm
            .validateFields()
            .then(values => {
                const { geometry_name } = values;
                geometryName.current = geometry_name;
                setShowGeometryNamePopup(false);
                updateGeometryName(geometry_name);
            })
            .catch(info => {
                // no UI/UX throw here so leave this blank for now, just need the validation.
            });
    }

    const updateGeometryName = (name) => {
        if (editingLayerId && editingLayerId !== '') {
            const layer: any = getLayerBasedOnId(editingLayerId);
            if (layer) {
                layer.options._name = name;
                layer.unbindTooltip();
                registerLayerNameAndTooltipClickEvent(layer);
                setEditingLayerId('');
                let geometry = mutableCouseSequencedGeometries.current.filter(geometry => {
                    return geometry.id === layer.options._id;
                })[0];
                if (geometry) {
                    geometry = JSON.parse(JSON.stringify(geometry));
                    geometry.properties.name = name;
                    mutableCouseSequencedGeometries.current = mutableCouseSequencedGeometries.current.filter(geometry => {
                        return geometry.id !== layer.options._id;
                    });
                    mutableCouseSequencedGeometries.current = [...mutableCouseSequencedGeometries.current, geometry];
                    dispatch(actions.setCourseSequencedGeometries(mutableCouseSequencedGeometries.current));
                }
            }
        }
    }

    const saveCourse = async (name) => {
        if (couseSequencedGeometries.length === 0) {
            toast.error(t(translations.course_create_update_page.you_cannot_create_course));
        }
        else {
            let response;
            toast.info(t(translations.course_create_update_page.saving));

            if (mode === MODE.CREATE)
                response = await create(eventId, name, couseSequencedGeometries);
            else
                response = await update(course.calendarEventId, courseId, name, couseSequencedGeometries);

            if (response.success) {
                toast.success(t(translations.course_create_update_page.successfully_created_your_course));
                setMode(MODE.UPDATE);
            } else {
                toast.error(t(translations.course_create_update_page.an_unexpected_error));
            }

            goBack();
        }
    }

    const cancelDraw = () => {
        setShowGeometryNamePopup(false);
        map.removeControl(drawControl);
        map.addControl(drawControl);
    }

    const goBack = () => {
        if (history.action !== 'POP') history.goBack();
        else {
            if (course && course.calendarEventId) {
                history.push(`/events/${course.calendarEventId}/update`);
            } else {
                history.push(`/events`);
            }
        }
    }

    const onCourseDeleted = () => {
        goBack();
    }

    const onNamePicked = (name) => {
        geometryNameForm.setFieldsValue({ geometry_name: name });
    }

    const renderDrawModeNamePicker = () => {
        switch (drawMode) {
            case LAYER_TYPE.polygon:
                return defaultPolygonNames.map(name => {
                    return <Tag onClick={() => onNamePicked(name)}>{name}</Tag>
                });
            case LAYER_TYPE.polyline:
                return defaultPolylineNames.map(name => {
                    return <Tag onClick={() => onNamePicked(name)}>{name}</Tag>
                });
            case LAYER_TYPE.marker:
                return defaultMarkerNames.map(name => {
                    return <Tag onClick={() => onNamePicked(name)}>{name}</Tag>
                });
        }
    }

    const performSaveCourse = () => {
        courseNameForm
            .validateFields()
            .then(values => {
                const { course_name } = values;
                saveCourse(course_name);
                setShowCourseNamePopup(false);
            })
            .catch(info => {
                // no UI/UX throw here so leave this blank for now, just need the validation.
            });
    }

    return (
        <>
            <CourseDeleteModal
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                onCourseDeleted={onCourseDeleted}
                course={course}
            />
            <Modal
                title={t(translations.course_create_update_page.please_enter_a_course_name)}
                bodyStyle={{ display: 'flex', justifyContent: 'center', overflow: 'hidden' }}
                onOk={performSaveCourse}
                onCancel={() => setShowCourseNamePopup(false)}
                visible={showCourseNamePopup}>
                <Form
                    form={courseNameForm}
                    layout="vertical"
                    name="basic"
                    style={{ width: '100%' }}

                    initialValues={{
                        course_name: '',
                    }}
                >
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.course_create_update_page.course_name)}</SyrfFieldLabel>}
                        name="course_name"
                        rules={[{ required: true, message: t(translations.forms.please_input_a_course_name) }]}
                    >
                        <SyrfInputField
                            autoCorrect="off"
                            placeholder={t(translations.course_create_update_page.input_a_name_for_this_course)}
                        />
                    </Form.Item>
                </Form>
            </Modal>


            <Modal
                title={t(translations.course_create_update_page.enter_geometry_name)}
                bodyStyle={{ display: 'flex', justifyContent: 'center', overflow: 'hidden' }}
                onOk={submitAndSetMarkerName}
                onCancel={cancelDraw}
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
                    <NamePickerContainer>
                        {renderDrawModeNamePicker()}
                    </NamePickerContainer>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.course_create_update_page.geometry_name)}</SyrfFieldLabel>}
                        name="geometry_name"
                        rules={[{ required: true, message: t(translations.forms.please_input_a_name_for_this_geometry) }]}
                    >
                        <SyrfInputField
                            autoCorrect="off"
                            placeholder={t(translations.course_create_update_page.input_a_name_for_this_geometry)}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
});

const Tag = styled.div`
    border-radius: 7px;
    margin: 5px 5px;
    padding: 5px 10px;
    background: ${StyleConstants.MAIN_TONE_COLOR};
    color: #fff;
    display: inline-block;
    cursor: pointer;
    font-size: 13px;
`;

const NamePickerContainer = styled.div`
    margin: 10px 0;
`;