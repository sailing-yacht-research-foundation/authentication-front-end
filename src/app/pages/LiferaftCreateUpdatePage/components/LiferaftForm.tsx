import React from 'react';
import { Spin, Form, Divider, DatePicker, Select, Row, Col } from 'antd';
import { SyrfFieldLabel, SyrfFormButton, SyrfFormSelect, SyrfFormWrapper, SyrfInputField } from 'app/components/SyrfForm';
import { DeleteButton, GobackButton, PageHeaderContainerResponsive, PageHeading, PageInfoContainer, PageInfoOutterWrapper } from 'app/components/SyrfGeneral';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { useHistory, useLocation, useParams } from 'react-router';
import { useForm } from 'antd/lib/form/Form';
import { create, update, getLifeRaft } from 'services/live-data-server/liferafts';
import { toast } from 'react-toastify';
import { BiTrash } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { IoIosArrowBack } from 'react-icons/io';
import { MODE, ownershipArray, TIME_FORMAT } from 'utils/constants';
import ReactTooltip from 'react-tooltip';
import { showToastMessageOnRequestError } from 'utils/helpers';
import moment from 'moment';
import { DeleteLiferaftModal } from './DeleteLifeRaftModal';

export const LiferaftForm = () => {
    const history = useHistory();

    const { t } = useTranslation();

    const location = useLocation();

    const [form] = useForm();

    const [isSaving, setIsSaving] = React.useState<boolean>(false);

    const [mode, setMode] = React.useState<string>(MODE.CREATE);

    const { id } = useParams<{ id: string }>();

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [liferaft, setLiferaft] = React.useState<any>({});

    const [formChanged, setFormChanged] = React.useState<boolean>(false);

    const { boatId } = useParams<{ boatId: string }>();

    const onFinish = async (values) => {
        let { serialNumber, manufacturer, capacity, model, container, lastServiceDate, manufactureDate, ownership } = values;
        let response;

        setIsSaving(true);

        const data = {
            serialNumber,
            vesselId: boatId,
            manufacturer,
            capacity,
            model,
            container,
            lastServiceDate: lastServiceDate ? lastServiceDate.format(TIME_FORMAT.number) : null,
            manufactureDate: manufactureDate ? manufactureDate.format(TIME_FORMAT.number) : null,
            ownership
        };

        if (mode === MODE.CREATE)
            response = await create(data);
        else
            response = await update(id, data);

        setIsSaving(false);

        if (response.success) {
            if (mode === MODE.CREATE) {
                toast.success(t(translations.vessel_create_update_page.created_a_new_liferaft));
                setLiferaft(response.data);
            } else {
                toast.success(t(translations.vessel_create_update_page.successfully_saved_liferaft));
            }

            history.push(`/boats/${boatId}/liferafts/${response.data?.id}/update`);
            setMode(MODE.UPDATE);
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const initModeAndData = async () => {
        if (location.pathname.includes(MODE.UPDATE)) {
            setMode(MODE.UPDATE);
            setIsSaving(true);
            const response = await getLifeRaft(id);
            setIsSaving(false);

            if (response.success) {
                setLiferaft(response.data);
                form.setFieldsValue({
                    ...response.data,
                    lastServiceDate: response.data?.lastServiceDate ? moment(response.data?.lastServiceDate) : '',
                    manufactureDate: response.data?.manufactureDate ? moment(response.data?.manufactureDate) : '',
                });
            } else {
                history.push('/404');
            }
        }
    }

    const onLiferaftDeleted = () => {
        history.push(`/boats/${boatId}/update`);
    }

    const renderOwnershipSelection = () => {
        return ownershipArray.map((criteria, index) => {
            return <Select.Option key={index} value={criteria}>{criteria}</Select.Option>
        })
    }

    React.useEffect(() => {
        initModeAndData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Wrapper>
            <DeleteLiferaftModal
                liferaft={liferaft}
                onLiferaftDeleted={onLiferaftDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />
            <PageHeaderContainerResponsive style={{ 'alignSelf': 'flex-start', width: '100%' }}>
                <PageInfoOutterWrapper>
                    <GobackButton onClick={() => {
                        history.push(`/boats/${boatId}/update`);
                    }}>
                        <IoIosArrowBack style={{ fontSize: '40px', color: '#1890ff' }} />
                    </GobackButton>
                    <PageInfoContainer>
                        <PageHeading>{mode === MODE.UPDATE ? t(translations.liferaft_create_update_page.update_liferaft) : t(translations.liferaft_create_update_page.create_a_new_liferaft)}</PageHeading>
                    </PageInfoContainer>
                </PageInfoOutterWrapper>
                {mode === MODE.UPDATE && <>
                    <DeleteButton
                        data-tip={t(translations.tip.delete_class)}
                        onClick={() => setShowDeleteModal(true)}
                        danger
                        icon={<BiTrash
                            style={{ marginRight: '5px' }}
                            size={18} />}>{t(translations.liferaft_create_update_page.delete_liferaft)}</DeleteButton>
                    <ReactTooltip />
                </>}
            </PageHeaderContainerResponsive>
            <SyrfFormWrapper>
                <Spin spinning={isSaving}>
                    <Form
                        layout={'vertical'}
                        name="basic"
                        form={form}
                        onFinish={onFinish}
                        initialValues={{
                            ownership: 'OWNED'
                        }}
                        onValuesChange={() => setFormChanged(true)}
                    >
                        <Row gutter={12}>
                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.liferaft_create_update_page.serial_number)}</SyrfFieldLabel>}
                                    name="serialNumber"
                                    data-tip={t(translations.liferaft_create_update_page.serial_number)}
                                    rules={[
                                        { required: true, message: t(translations.forms.serial_number_is_required) },
                                        { max: 20, message: t(translations.forms.serial_number_must_not_be_greater_than_20_chars) }
                                    ]}
                                >
                                    <SyrfInputField autoCorrect="off" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={8} lg={8}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.liferaft_create_update_page.manufacturer)}</SyrfFieldLabel>}
                                    name="manufacturer"
                                    data-tip={t(translations.liferaft_create_update_page.manufacturer)}
                                    rules={[{ max: 45, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 45 }) }]}
                                >
                                <SyrfInputField autoCorrect="off" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={8} lg={8}>
                            <Form.Item
                                label={<SyrfFieldLabel>{t(translations.liferaft_create_update_page.capacity)}</SyrfFieldLabel>}
                                name="capacity"
                                rules={[() => ({
                                    validator(_, value) {
                                        if (value && isNaN(value) && value.length > 0) {
                                            return Promise.reject(t(translations.forms.please_input_number));
                                        }
                                        return Promise.resolve();
                                    },
                                })]}
                                data-tip={t(translations.liferaft_create_update_page.capacity)}
                            >
                                <SyrfInputField autoCorrect="off" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={12}>
                        <Col xs={24} sm={24} md={8} lg={8}>
                            <Form.Item
                                label={<SyrfFieldLabel>{t(translations.liferaft_create_update_page.model)}</SyrfFieldLabel>}
                                name="model"
                                data-tip={t(translations.liferaft_create_update_page.model)}
                                rules={[{ max: 30, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 30 }) }]}
                            >
                                <SyrfInputField autoCorrect="off" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={8} lg={8}>
                            <Form.Item
                                label={<SyrfFieldLabel>{t(translations.liferaft_create_update_page.container)}</SyrfFieldLabel>}
                                name="container"
                                data-tip={t(translations.liferaft_create_update_page.container)}
                                rules={[{ max: 30, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 30 }) }]}
                            >
                                <SyrfInputField autoCorrect="off" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={8} lg={8}>
                            <Form.Item
                                label={<SyrfFieldLabel>{t(translations.liferaft_create_update_page.last_service_date)}</SyrfFieldLabel>}
                                name="lastServiceDate"
                                data-tip={t(translations.liferaft_create_update_page.last_service_date)}
                            >
                                <DatePicker
                                    allowClear={false}
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
                    </Row>

                    <Row gutter={12}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item
                                label={<SyrfFieldLabel>{t(translations.liferaft_create_update_page.manufacture_date)}</SyrfFieldLabel>}
                                name="manufactureDate"
                                data-tip={t(translations.liferaft_create_update_page.manufacture_date)}
                            >
                                <DatePicker
                                    allowClear={false}
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
                                label={<SyrfFieldLabel>{t(translations.liferaft_create_update_page.ownership)}</SyrfFieldLabel>}
                                name="ownership"
                                data-tip={t(translations.liferaft_create_update_page.ownership)}
                            >
                                <SyrfFormSelect>
                                    {renderOwnershipSelection()}
                                </SyrfFormSelect>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider />

                    <Form.Item>
                        <SyrfFormButton disabled={!formChanged} type="primary" htmlType="submit">
                            {t(translations.liferaft_create_update_page.save_liferaft)}
                        </SyrfFormButton>
                    </Form.Item>
                </Form>
            </Spin>
        </SyrfFormWrapper>
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