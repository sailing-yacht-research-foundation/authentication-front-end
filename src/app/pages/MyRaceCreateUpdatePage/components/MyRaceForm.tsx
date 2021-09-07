import 'leaflet/dist/leaflet.css';

import React from 'react';
import { Spin, Form, Input, DatePicker, Row, Col, Divider, Switch, TimePicker } from 'antd';
import { CreateButton, PageHeaderContainer, PageHeaderText } from 'app/components/SyrfGeneral';
import { SyrfFormButton, SyrfFormWrapper, SyrfInputField } from 'app/components/SyrfForm';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { LocationPicker } from './LocationPicker';
import { useForm } from 'antd/lib/form/Form';
import { create, get, update } from 'services/live-data-server/event-calendars';
import moment from 'moment';
import { useHistory, useLocation, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { BsCardList } from 'react-icons/bs';
import { CompetitionUnitList } from './CompetitionUnitList';
import { MAP_DEFAULT_VALUE } from 'utils/helpers';

const MODE = {
    CREATE: 'create',
    UPDATE: 'update'
}

export const MyRaceForm = () => {

    const history = useHistory();

    const location = useLocation();

    const [form] = useForm();

    const [isSavingRace, setIsSavingRace] = React.useState<boolean>(false);

    const [mode, setMode] = React.useState<string>(MODE.CREATE);

    const { raceId } = useParams<{ raceId: string }>();

    const [coordinates, setCoordinates] = React.useState<any>({})

    const onFinish = async (values) => {
        const { name, locationName, startDate, externalUrl, lon, lat, endDate, isPrivate, startTime } = values;
        let response;
        let currentDate = moment();

        if (endDate) {
            currentDate = endDate;
        }

        setIsSavingRace(true);

        const data = {
            name: name,
            locationName: locationName,
            externalUrl: externalUrl,
            lon: lon,
            lat: lat,
            approximateStartTime: startDate ? moment(startDate.format("YYYY-MM-DD") + ' ' + startTime.format("HH:mm:ss")) : moment().format("YYYY-MM-DD HH:mm:ss"),
            startDay: startDate.format('DD'),
            startMonth: startDate.format('MM'),
            startYear: startDate.format('YYYY'),
            endDay: currentDate.format('DD'),
            endMonth: currentDate.format('MM'),
            endYear: currentDate.format('YYYY'),
            ics: "ics",
            isPrivate: isPrivate
        };

        if (mode === MODE.CREATE)
            response = await create(data);
        else
            response = await update(raceId, data);

        setIsSavingRace(false);

        if (response.success) {
            if (mode === MODE.CREATE) {
                toast.success('Created a new race with name: ' + response.data?.name);
            } else {
                toast.success('Successfully updated your race: ' + response.data?.name);
            }

            history.push(`/my-races/${response.data?.id}/update`);
            setMode(MODE.UPDATE);
        } else {
            toast.error('An error happened when saving your race.');
        }
    }

    const onChoosedLocation = (lat, lon) => {
        form.setFieldsValue({
            lat: lat,
            lon: lon
        });
    }

    const initModeAndData = async () => {
        if (location.pathname.includes(MODE.UPDATE)) {
            setMode(MODE.UPDATE);

            setIsSavingRace(true);
            const response = await get(raceId);
            setIsSavingRace(false);

            if (response.success) {
                form.setFieldsValue({
                    ...response.data,
                    startDate: moment(response.data?.approximateStartTime),
                    startTime: moment(response.data?.approximateStartTime)
                });
                setCoordinates({
                    lat: response.data.lat,
                    lon: response.data.lon
                })
            } else {
                history.push('/404');
            }
        }
    }

    React.useEffect(() => {
        initModeAndData();
    }, []);

    return (
        <Wrapper>
            <PageHeaderContainer style={{ 'alignSelf': 'flex-start', width: '100%' }}>
                <PageHeaderText>{mode == MODE.UPDATE ? 'Update your race' : 'Create a new race'}</PageHeaderText>
                <CreateButton onClick={() => history.push("/my-races")} icon={<BsCardList
                    style={{ marginRight: '5px' }}
                    size={18} />}>View all</CreateButton>
            </PageHeaderContainer>
            <SyrfFormWrapper>
                <Spin spinning={isSavingRace}>
                    <Form
                        layout={'vertical'}
                        name="basic"
                        form={form}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true }]}
                        >
                            <SyrfInputField />
                        </Form.Item>

                        <Divider />

                        <Form.Item
                            label="Location name"
                            name="locationName"
                            rules={[{ required: true }]}
                        >
                            <SyrfInputField />
                        </Form.Item>

                        <Row gutter={24}>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Form.Item
                                    label={'Longitude'}
                                    name="lon"
                                    rules={[{ required: true }]}
                                >
                                    <SyrfInputField disabled />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Form.Item
                                    label={'Latitude'}
                                    name="lat"
                                    rules={[{ required: true }]}
                                >
                                    <SyrfInputField disabled />
                                </Form.Item>
                            </Col>
                        </Row>

                        {(mode == MODE.UPDATE && coordinates.lat) && <LocationPicker coordinates={coordinates} onChoosedLocation={onChoosedLocation} />}
                        {mode == MODE.CREATE && <LocationPicker coordinates={MAP_DEFAULT_VALUE.CENTER} onChoosedLocation={onChoosedLocation} />}

                        <Row gutter={12}>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Form.Item
                                    label={'Start Date'}
                                    name="startDate"
                                    rules={[{ type: 'date', required: true }]}
                                >
                                    <DatePicker
                                        showToday={true}
                                        className="syrf-datepicker"
                                        style={{ width: '100%' }}
                                        dateRender={current => {
                                            return (
                                                <div className="ant-picker-cell-inner">
                                                    {current.date()}
                                                </div>
                                            );
                                        }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Form.Item
                                    label={'Start Time'}
                                    name="startTime"
                                    rules={[{ required: true }]}
                                >
                                    <TimePicker className="syrf-datepicker" defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label="External URL"
                            name="externalUrl"
                            rules={[{ type: 'url' }]}
                        >
                            <SyrfInputField />
                        </Form.Item>

                        <Form.Item label="Is private?" name="isPrivate" valuePropName="checked" initialValue={false}>
                            <Switch />
                        </Form.Item>

                        <Form.Item>
                            <SyrfFormButton type="primary" htmlType="submit">
                                Save Race
                            </SyrfFormButton>
                        </Form.Item>
                    </Form>
                </Spin>
            </SyrfFormWrapper>

            {
                mode === MODE.UPDATE && <SyrfFormWrapper style={{ marginTop: '30px' }}>
                    <CompetitionUnitList raceId={raceId} />
                </SyrfFormWrapper>
            }
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    margin-top: ${StyleConstants.NAV_BAR_HEIGHT};
`;