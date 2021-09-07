import React from 'react';
import { Spin, Form, Divider, DatePicker, Switch, Row, Col, TimePicker } from 'antd';
import { SyrfFormButton, SyrfFormWrapper, SyrfInputField } from 'app/components/SyrfForm';
import { CreateButton, PageHeaderContainer, PageHeaderText } from 'app/components/SyrfGeneral';
import { BsCardList } from 'react-icons/bs';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { useHistory, useLocation, useParams } from 'react-router';
import { useForm } from 'antd/lib/form/Form';
import moment from 'moment';
import { create, update, get } from 'services/live-data-server/competition-units';
import { BoundingBoxPicker } from './BoundingBoxPicker';
import { toast } from 'react-toastify';

const MODE = {
    UPDATE: 'update',
    CREATE: 'create'
}

export const CompetitionUnitForm = () => {
    const history = useHistory();

    const location = useLocation();

    const [form] = useForm();

    const [isSaving, setIsSaving] = React.useState<boolean>(false);

    const [mode, setMode] = React.useState<string>(MODE.CREATE);

    const { raceId, competitionUnitId } = useParams<{ raceId: string, competitionUnitId: string }>();

    const [boundingBoxCoordinates, setBoundingBoxCoordinates] = React.useState([]);

    const onFinish = async (values) => {
        const { name, startDate, startTime, isCompeleted } = values;
        let response;

        setIsSaving(true);

        const data = {
            name: name,
            startTime: moment(startDate.format("YYYY-MM-DD") + ' ' + startTime.format("HH:mm:ss")),
            approximateStart: moment(startDate.format("YYYY-MM-DD") + ' ' + startTime.format("HH:mm:ss")),
            isCompleted: true,
            boundingBox: boundingBoxCoordinates.length > 0 ?
                {
                    "type": "Polygon",
                    "coordinates": [...boundingBoxCoordinates]
                }
                : null,
            calendarEventId: raceId
        };

        if (mode === MODE.CREATE)
            response = await create(raceId, data);
        else
            response = await update(raceId, competitionUnitId, data);


        setIsSaving(false);

        if (response.success) {
            if (mode === MODE.CREATE) {
                toast.success('Created a new competition unit with name: ' + response.data?.name);
            } else {
                toast.success('Successfully updated your competition unit: ' + response.data?.name);
            }

            history.push(`/my-races/${raceId}/competition-units/${response.data?.id}/update`);
            setMode(MODE.UPDATE);
        } else {
            toast.error('An error happened when saving your race.');
        }
    }

    const initModeAndData = async () => {
        if (location.pathname.includes(MODE.UPDATE)) {
            setMode(MODE.UPDATE);

            setIsSaving(true);
            const response = await get(raceId, competitionUnitId);
            setIsSaving(false);

            if (response.success) {
                form.setFieldsValue({
                    ...response.data,
                    startDate: moment(response.data?.approximateStartTime),
                    startTime: moment(response.data?.approximateStartTime)
                });
                if (response.data?.boundingBox?.coordinates)
                    setBoundingBoxCoordinates(response.data?.boundingBox?.coordinates);
            } else {
                history.push('/404');
            }
        }
    }

    const onCoordinatesRecevied = (coordinates) => {
        setBoundingBoxCoordinates(coordinates);
    }

    React.useEffect(() => {
        initModeAndData();
    }, []);

    return (
        <Wrapper>
            <PageHeaderContainer style={{ 'alignSelf': 'flex-start', width: '100%' }}>
                <PageHeaderText>{mode == MODE.UPDATE ? 'Update your competiton unit' : 'Create a new competition unit'}</PageHeaderText>
                <CreateButton onClick={() => history.push("/my-races")} icon={<BsCardList
                    style={{ marginRight: '5px' }}
                    size={18} />}>View all competition units</CreateButton>
            </PageHeaderContainer>
            <SyrfFormWrapper>
                <Spin spinning={isSaving}>
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

                        <BoundingBoxPicker coordinates={boundingBoxCoordinates} onCoordinatesRecevied={onCoordinatesRecevied} />

                        <Form.Item label="Is completed?" name="isCompleted" valuePropName="checked" initialValue={false}>
                            <Switch />
                        </Form.Item>

                        <Form.Item>
                            <SyrfFormButton type="primary" htmlType="submit">
                                Save Competition Unit
                            </SyrfFormButton>
                        </Form.Item>
                    </Form>
                </Spin>
            </SyrfFormWrapper>

            <SyrfFormWrapper style={{ marginTop: '30px' }}>
                {/* <CompetitionUnitList /> */}
            </SyrfFormWrapper>
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