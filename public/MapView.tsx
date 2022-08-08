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
import { addNonGroupLayers, showToastMessageOnRequestError } from 'utils/helpers';
import ReactDOMServer from 'react-dom/server';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { CourseDeleteModal } from '../CourseDeleteModal';
import { GeometrySide, GeometryType, MODE } from 'utils/constants';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import BoatPinIcon from '../../assets/boat_pin.png';
import StartPinIcon from '../../assets/start_pin.png';
import { addTrackerIdForCourseIfNotExists } from 'utils/api-helper';

require('leaflet-draw');

L.Draw.Polyline.prototype.addVertex = function (latlng) {
    var markersLength = this._markers.length;
    // markersLength must be greater than or equal to 2 before intersections can occur

    if (markersLength >= 2 && !this.options.allowIntersection && this._poly.newLatLngIntersects(latlng)) {
        this._showErrorTooltip();
        return;
    }
    else if (this._errorShown) {
        this._hideErrorTooltip();
    }

    this._markers.push(this._createMarker(latlng));

    this._poly.addLatLng(latlng);

    if (this._poly.getLatLngs().length === 2) {
        this._map.addLayer(this._poly);
    }

    this._vertexChanged(latlng, true);
    markersLength = this._markers.length;
    if (markersLength === 2) {
        this._fireCreatedEvent();
        this.disable();
    }
};

type CourseGeometry = {
    geometryType: string;
    coordinates: any[][];
    properties: any;
    order: number;
    id: string;
    points: any[];
};

const LAYER_TYPE = {
    marker: 'marker',
    polygon: 'polygon',
    polyline: 'polyline'
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

    const layerOrder = React.useRef(0);

    const geometryName = React.useRef('');

    const [showGeometryNamePopup, setShowGeometryNamePopup] = React.useState<boolean>(false);

    const [showCourseNamePopup, setShowCourseNamePopup] = React.useState<boolean>(false);

    const [geometryNameForm] = Form.useForm();

    const [courseNameForm] = Form.useForm();

    const { actions } = useCourseSlice();

    const courseSequencedGeometries = useSelector(selectCourseSequencedGeometries);

    const mutableCourseSequencedGeometries = React.useRef<any[]>([]);

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
                },
                edit: false
            },
            draw: {
                rectangle: false,
                circle: false,
                circlemarker: false,
                polygon: false,
                marker: false
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
                    mutableCourseSequencedGeometries.current = courseSequencedGeometriesData;
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
        courseSequencedGeometriesData.forEach(geometry => {
            let geoJsonGroup;

            switch (geometry.geometryType) {
                case GeometryType.POLYLINE:
                    const coordinates = geometry.points.map(function (point) {
                        return point.position;
                    });
                    geoJsonGroup = L.polyline([...coordinates]).addTo(map);
                    geoJsonGroup.options._geometry_type = GeometryType.POLYLINE;
                    drawPointAndBoat(coordinates, geometry.id);
                    break;
                case GeometryType.POINT:
                    geoJsonGroup = L.marker(geometry.points[0].position, {
                        icon: L.divIcon({
                            html: ReactDOMServer.renderToString(<FaMapMarkerAlt style={{ color: '#fff', fontSize: '35px' }} />),
                            iconSize: [20, 20],
                            className: 'my-race'
                        })
                    }).addTo(map);
                    geoJsonGroup.options._geometry_type = GeometryType.POINT;
                    break;
                case GeometryType.POLYGON:
                    geoJsonGroup = L.polygon([geometry.points.map(function (point) {
                        return point.position;
                    })]).addTo(map);
                    geoJsonGroup.options._geometry_type = GeometryType.POLYGON;
                    break;
            }

            geoJsonGroup.options._id = geometry.id;
            geoJsonGroup.options._name = geometry.properties?.name || 'Unnamed';
            registerLayerNameAndTooltipClickEvent(geoJsonGroup);
            addNonGroupLayers(geoJsonGroup, drawnItems);
        })
    }

    const registerOnLayersDeletedEvent = () => {
        map.on(L.Draw.Event.DELETED, function (e) {
            e.layers.eachLayer(layer => {
                mutableCourseSequencedGeometries.current = mutableCourseSequencedGeometries.current.filter(geometry => {
                    return geometry.id !== layer.options._id;
                });

                map.eachLayer(function (mapLayer) {
                    if (layer.options._id === mapLayer.options._parent_id
                        && typeof mapLayer.options._parent_id !== 'undefined') {
                        map.removeLayer(mapLayer);
                    }
                });
            });
            dispatch(actions.setCourseSequencedGeometries(mutableCourseSequencedGeometries.current));
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
                let geometry = mutableCourseSequencedGeometries.current.filter(geometry => {
                    return geometry.id === layer.options._id;
                })[0];
                mutableCourseSequencedGeometries.current = mutableCourseSequencedGeometries.current.filter(geometry => {
                    return geometry.id !== layer.options._id;
                });
                if (geometry) {
                    geometry = JSON.parse(JSON.stringify(geometry));
                    const geometryType = layer.options._geometry_type;
                    switch (geometryType) {
                        case GeometryType.POINT:
                            geometry.points[0].position = [layer.getLatLng().lat, layer.getLatLng().lng]
                            break;
                        case GeometryType.POLYGON:
                        case GeometryType.POLYLINE:
                            layer.getLatLngs().forEach((points, pointIndex) => {
                                if (points.forEach) {
                                    points.forEach((point, index) => {
                                        if (!geometry.points[index]) {
                                            geometry.points[index] = {
                                                position: []
                                            }
                                        }
                                        geometry.points[index].position = [point.lat, point.lng]
                                    });
                                } else {
                                    let point = points; // in this case points is not an array.
                                    geometry.points[pointIndex].position = [point.lat, point.lng];
                                }
                            });
                            if (geometryType === GeometryType.POLYGON) { // polygon only, making this polygon first position & last position the same as discussed with Aan.
                                enclosePolygonPoints(geometry);
                            }
                            drawPointAndBoat(layer.getLatLngs().map(point => [point.lat, point.lng]), geometry.id);
                            break;
                    }
                    mutableCourseSequencedGeometries.current.push(geometry);
                }
                registerLayerNameAndTooltipClickEvent(layer);
            });
            dispatch(actions.setCourseSequencedGeometries(mutableCourseSequencedGeometries.current));
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
                    points: []
                };

            switch (layerType) {
                case LAYER_TYPE.marker:
                    geometry.geometryType = GeometryType.POINT;
                    geometry.points.push({
                        position: [layer.getLatLng().lat, layer.getLatLng().lng]
                    })
                    layer.options._geometry_type = GeometryType.POINT;
                    break;
                case LAYER_TYPE.polygon:
                    geometry.geometryType = GeometryType.POLYGON;
                    layer.getLatLngs().forEach(points => {
                        points.forEach(point => {
                            geometry.points.push({
                                position: [point.lat, point.lng]
                            })
                        });
                    });
                    enclosePolygonPoints(geometry);
                    layer.options._geometry_type = GeometryType.POLYGON;
                    break;
                case LAYER_TYPE.polyline:
                    geometry.geometryType = GeometryType.POLYLINE;
                    layer.getLatLngs().forEach(function (point, index) {
                        geometry.points.push({
                            position: [point.lat, point.lng],
                            properties: {
                                side: index === 0 ? GeometrySide.PORT : GeometrySide.STARBOARD
                                // Port is for the start pin and it’s always on the left side of the start line,
                                // Starboard is for the boat pin and it’s always on the right side of the start line
                                // index == 0 means the pin, 1 means the boat.
                                // Check drawPointAndBoat function for more information.
                            }
                        });
                    });
                    drawPointAndBoat(layer.getLatLngs().map(point => [point.lat, point.lng]), layerId);
                    layer.options._geometry_type = GeometryType.POLYLINE;
                    break;
            }

            layer.options._name = geometryName.current;
            layer.options._id = layerId;

            registerLayerNameAndTooltipClickEvent(layer);
            drawnItems.addLayer(layer);
            mutableCourseSequencedGeometries.current = [...mutableCourseSequencedGeometries.current, geometry];
            dispatch(actions.setCourseSequencedGeometries(JSON.parse(JSON.stringify(mutableCourseSequencedGeometries.current))));
            layerOrder.current++;
        });
    }

    const drawPointAndBoat = (coordinates, layerId) => {
        map.eachLayer(function (mapLayer) {
            if (layerId === mapLayer.options._parent_id
                && typeof mapLayer.options._parent_id !== 'undefined') {
                map.removeLayer(mapLayer);
            }
        });

        coordinates.forEach(function (point, index) {
            let marker;
            if (index === 0) { // pin
                marker = L.marker([point[0], point[1]], {
                    icon: new L.icon({
                        iconUrl: StartPinIcon,
                        iconSize: [25, 25],
                        iconAnchor: [14, 10],
                        popupAnchor: [5, -15]
                    })
                });
            } else { // boat
                marker = L.marker([point[0], point[1]], {
                    icon: new L.icon({
                        iconUrl: BoatPinIcon,
                        iconSize: [25, 25],
                        iconAnchor: [14, 10],
                        popupAnchor: [5, -15]
                    })
                });
            }
            marker.options._parent_id = layerId;
            map.addLayer(marker);
        });
    }

    const enclosePolygonPoints = (geometry) => {
        const firstPoint = geometry?.points[0];
        const lastPoint = geometry?.points[geometry?.points?.length - 1];
        if (firstPoint?.position[0] !== lastPoint?.position[0] &&
            firstPoint?.position[1] !== lastPoint?.position[1]) { // lon & lat comparison.
            geometry.points.push({
                position: [firstPoint?.position[0], firstPoint?.position[1]]
            });
        }
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
                let geometry = mutableCourseSequencedGeometries.current.filter(geometry => {
                    return geometry.id === layer.options._id;
                })[0];
                if (geometry) {
                    geometry = JSON.parse(JSON.stringify(geometry));
                    geometry.properties.name = name;
                    mutableCourseSequencedGeometries.current = mutableCourseSequencedGeometries.current.filter(geometry => {
                        return geometry.id !== layer.options._id;
                    });
                    mutableCourseSequencedGeometries.current = [...mutableCourseSequencedGeometries.current, geometry];
                    dispatch(actions.setCourseSequencedGeometries(mutableCourseSequencedGeometries.current));
                }
            }
        }
    }

    const saveCourse = async (name) => {
        if (courseSequencedGeometries.length === 0) {
            toast.error(t(translations.course_create_update_page.you_cannot_create_course));
        }
        else {
            let response;
            toast.info(t(translations.course_create_update_page.saving));

            const modifiedCourseSequencedGeometries = await addTrackerIdForCourseIfNotExists(courseSequencedGeometries, eventId);

            if (mode === MODE.CREATE)
                response = await create(eventId, name, modifiedCourseSequencedGeometries);
            else
                response = await update(course.calendarEventId, courseId, name, modifiedCourseSequencedGeometries);

            if (response.success) {
                toast.success(t(translations.course_create_update_page.successfully_created_your_course));
                setMode(MODE.UPDATE);
            } else {
                showToastMessageOnRequestError(response.error);
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
                return defaultPolygonNames.map((name, index) => {
                    return <Tag key={index} onClick={() => onNamePicked(name)}>{name}</Tag>
                });
            case LAYER_TYPE.polyline:
                return defaultPolylineNames.map((name, index) => {
                    return <Tag key={index} onClick={() => onNamePicked(name)}>{name}</Tag>
                });
            case LAYER_TYPE.marker:
                return defaultMarkerNames.map((name, index) => {
                    return <Tag key={index} onClick={() => onNamePicked(name)}>{name}</Tag>
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
