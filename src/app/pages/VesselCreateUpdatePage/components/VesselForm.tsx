import 'react-phone-input-2/lib/style.css';

import React from 'react';
import { Spin, Form, Divider, Space, Row, Col, Select } from 'antd';
import { SyrfFieldLabel, SyrfFormButton, SyrfFormSelect, SyrfFormWrapper, SyrfInputField, SyrfPhoneInput } from 'app/components/SyrfForm';
import { DeleteButton, GobackButton, PageDescription, PageHeaderContainerResponsive, PageHeading, PageInfoContainer, PageInfoOutterWrapper } from 'app/components/SyrfGeneral';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { useHistory, useLocation, useParams } from 'react-router';
import { useForm } from 'antd/lib/form/Form';
import { create, update, get } from 'services/live-data-server/vessels';
import { toast } from 'react-toastify';
import { DeleteVesselModal } from 'app/pages/VesselListPage/components/DeleteVesselModal';
import { BiTrash } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { MODE, VesselType } from 'utils/constants';
import { IoIosArrowBack } from 'react-icons/io';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { LiferaftList } from './LiferaftList';
import { PDFUploadForm } from './PDFUploadForm';

export const VesselForm = () => {
    const history = useHistory();

    const { t } = useTranslation();

    const location = useLocation();

    const [form] = useForm();

    const [isSaving, setIsSaving] = React.useState<boolean>(false);

    const [mode, setMode] = React.useState<string>(MODE.CREATE);

    const { id } = useParams<{ id: string }>();

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [vessel, setVessel] = React.useState<any>({});

    const [formChanged, setFormChanged] = React.useState<boolean>(false);

    const vesselTypes = [
        { name: 'Foid board', value: VesselType.FOIL_BOARD },
        { name: 'Keel boat', value: VesselType.KEELBOAT },
        { name: 'Dinghy', value: VesselType.DINGHY },
        { name: 'Other', value: VesselType.OTHER }
    ]

    const onFinish = async (values) => {
        let { publicName, lengthInMeters } = values;
        let response;

        setIsSaving(true);

        const data = {
            publicName: publicName,
            lengthInMeters: lengthInMeters,
            orcJsonPolars: {}
        };

        if (mode === MODE.CREATE)
            response = await create(data);
        else
            response = await update(id, data);


        setIsSaving(false);

        if (response.success) {
            if (mode === MODE.CREATE) {
                toast.success(t(translations.vessel_create_update_page.created_a_new_vessel, { name: response.data?.publicName }));
                setVessel(response.data);
            } else {
                toast.success(t(translations.vessel_create_update_page.successfully_updated_vessel, { name: response.data?.publicName }));
            }

            history.push(`/boats/${response.data?.id}/update`);
            setMode(MODE.UPDATE);
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const initModeAndData = async () => {
        if (location.pathname.includes(MODE.UPDATE)) {
            setMode(MODE.UPDATE);
            setIsSaving(true);
            const response = await get(id);
            setIsSaving(false);

            if (response.success) {
                setVessel(response.data);
                form.setFieldsValue({
                    ...response.data
                });
            } else {
                history.push('/404');
            }
        }
    }

    const onVesselDeleted = () => {
        history.push('/boats');
    }

    const renderVesselType = () => {
        return vesselTypes.map((type, index) => {
            return <Select.Option key={index} value={type.value}>{type.name}</Select.Option>
        });
    }

    React.useEffect(() => {
        initModeAndData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Wrapper>
            <DeleteVesselModal
                vessel={vessel}
                onVesselDeleted={onVesselDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />
            <PageHeaderContainerResponsive style={{ 'alignSelf': 'flex-start', width: '100%' }}>
                <PageInfoOutterWrapper>
                    <GobackButton onClick={() => history.push("/boats")}>
                        <IoIosArrowBack style={{ fontSize: '40px', color: '#1890ff' }} />
                    </GobackButton>
                    <PageInfoContainer>
                        <PageHeading>{mode === MODE.UPDATE ? t(translations.vessel_create_update_page.update_your_vessel) : t(translations.vessel_create_update_page.create_a_new_vessel)}</PageHeading>
                        <PageDescription>{t(translations.vessel_create_update_page.vessel_are_yatchs)}</PageDescription>
                    </PageInfoContainer>
                </PageInfoOutterWrapper>
                <Space size={10}>
                    {mode === MODE.UPDATE && <DeleteButton onClick={() => setShowDeleteModal(true)} danger icon={<BiTrash
                        style={{ marginRight: '5px' }}
                        size={18} />}>{t(translations.vessel_create_update_page.delete)}</DeleteButton>}

                </Space>
            </PageHeaderContainerResponsive>
            <SyrfFormWrapper>
                <Spin spinning={isSaving}>
                    <Form
                        layout={'vertical'}
                        name="basic"
                        form={form}
                        onFinish={onFinish}
                        onValuesChange={() => setFormChanged(true)}
                    >
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.public_name)}</SyrfFieldLabel>}
                            name="publicName"
                            rules={[{ required: true, message: t(translations.forms.boat_name_is_required) }]}
                        >
                            <SyrfInputField autoCorrect="off" />
                        </Form.Item>


                        <Row gutter={12}>
                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.length_in_meters)}</SyrfFieldLabel>}
                                    name="lengthInMeters"
                                    rules={[() => ({
                                        validator(_, value) {
                                            if (value === null) {
                                                return Promise.reject(t(translations.vessel_create_update_page.length_in_meters_is_required));
                                            }
                                            if (isNaN(value) || value <= 0) {
                                                return Promise.reject(t(translations.vessel_create_update_page.length_in_meters_must_be_a_number));
                                            }
                                            return Promise.resolve();
                                        },
                                    }), { required: true, message: t(translations.vessel_create_update_page.length_in_meters_is_required) }]}
                                >
                                    <SyrfInputField autoCorrect="off" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.model)}</SyrfFieldLabel>}
                                    name="model"
                                >
                                    <SyrfInputField autoCorrect="off" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.vessel_type)}</SyrfFieldLabel>}
                                    name="vesselType"
                                >
                                    <SyrfFormSelect>
                                        {renderVesselType()}
                                    </SyrfFormSelect>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.sail_number)}</SyrfFieldLabel>}
                                    name="sailNumber"
                                >
                                    <SyrfInputField autoCorrect="off" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.hull_number)}</SyrfFieldLabel>}
                                    name="hullNumber"
                                >
                                    <SyrfInputField autoCorrect="off" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.call_sign)}</SyrfFieldLabel>}
                                    name="callSign"
                                >
                                    <SyrfInputField autoCorrect="off" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.hull_color_above_the_water_line)}</SyrfFieldLabel>}
                                    name="hullColorAboveWaterline"
                                >
                                    <SyrfInputField autoCorrect="off" />
                                </Form.Item>

                            </Col>
                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.hull_color_below_the_water_line)}</SyrfFieldLabel>}
                                    name="hullColorBelowWaterline"
                                >
                                    <SyrfInputField autoCorrect="off" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.hulls_count)}</SyrfFieldLabel>}
                                    rules={[() => ({
                                        validator(_, value) {
                                            if (isNaN(value) && value.length > 0) {
                                                return Promise.reject(t(translations.vessel_create_update_page.hulls_count_must_be_a_number));
                                            }
                                            return Promise.resolve();
                                        },
                                    })]}
                                    name="hullsCount"
                                >
                                    <SyrfInputField autoCorrect="off" />
                                </Form.Item>

                            </Col>
                        </Row>


                        <Row gutter={12}>
                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.deck_color)}</SyrfFieldLabel>}
                                    name="deckColor"
                                >
                                    <SyrfInputField autoCorrect="off" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.mmsi)}</SyrfFieldLabel>}
                                    name="mmsi"
                                >
                                    <SyrfInputField autoCorrect="off" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.ssbTransceiver)}</SyrfFieldLabel>}
                                    name="ssbTransceiver"
                                >
                                    <SyrfInputField autoCorrect="off" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.homeport)}</SyrfFieldLabel>}
                                    name="homeport"
                                >
                                    <SyrfInputField autoCorrect="off" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.rigging)}</SyrfFieldLabel>}
                                    name="rigging"
                                >
                                    <SyrfInputField autoCorrect="off" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.marina_phoneNumber)}</SyrfFieldLabel>}
                                    name="marinaPhoneNumber"
                                >
                                    <SyrfPhoneInput
                                        inputClass="syrf-phone-number-input"
                                        buttonClass="syrf-flag-dropdown"
                                        placeholder={t(translations.profile_page.update_profile.enter_phone_number)} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.satellite_number)}</SyrfFieldLabel>}
                                    name="satelliteNumber"
                                >
                                    <SyrfPhoneInput
                                        inputClass="syrf-phone-number-input"
                                        buttonClass="syrf-flag-dropdown"
                                        placeholder={t(translations.profile_page.update_profile.enter_phone_number)} />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.onboard_phone)}</SyrfFieldLabel>}
                                    name="onboardPhone"
                                >
                                    <SyrfPhoneInput
                                        inputClass="syrf-phone-number-input"
                                        buttonClass="syrf-flag-dropdown"
                                        placeholder={t(translations.profile_page.update_profile.enter_phone_number)} />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    rules={[{ type: 'email', message: t(translations.vessel_create_update_page.onboard_email_is_not_a_valid_email) }]}
                                    label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.onboard_email)}</SyrfFieldLabel>}
                                    name="onboardEmail"
                                >
                                    <SyrfInputField autoCorrect="off" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.epirbHexId)}</SyrfFieldLabel>}
                            name="epirbHexId"
                        >
                            <SyrfInputField autoCorrect="off" />
                        </Form.Item>

                        <Divider />

                        <Form.Item>
                            <SyrfFormButton disabled={!formChanged} type="primary" htmlType="submit">
                                {t(translations.vessel_create_update_page.save_vessel)}
                            </SyrfFormButton>
                        </Form.Item>
                    </Form>
                </Spin>
            </SyrfFormWrapper>

            {mode === MODE.UPDATE && vessel.id &&
                <>
                    <PDFUploadForm reloadVessel={initModeAndData} vessel={vessel} />
                    <LiferaftList vesselId={vessel.id} />
                </>}
        </Wrapper >
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