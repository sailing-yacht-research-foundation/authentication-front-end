import 'react-phone-input-2/lib/style.css';

import React from 'react';
import { Spin, Form, Space } from 'antd';
import { SyrfFormWrapper } from 'app/components/SyrfForm';
import { DeleteButton, GobackButton, PageDescription, PageHeaderContainerResponsive, PageHeading, PageInfoContainer, PageInfoOutterWrapper } from 'app/components/SyrfGeneral';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { useHistory, useLocation, useParams } from 'react-router';
import { useForm } from 'antd/lib/form/Form';
import { createMultipart, updateMultipart, get, removePhotos, sendPhoneVerification, verifyPhones, sendOnboardEmailCode, verifyOnboardEmail } from 'services/live-data-server/vessels';
import { toast } from 'react-toastify';
import { DeleteVesselModal } from 'app/pages/VesselListPage/components/DeleteVesselModal';
import { BiTrash } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { AdminType, MODE, VesselType } from 'utils/constants';
import { IoIosArrowBack } from 'react-icons/io';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { LiferaftList } from './LiferaftList';
import { PDFUploadForm } from './PDFUploadForm';
import { ConfirmModal } from 'app/components/ConfirmModal';
import { VerifyPhoneModal } from 'app/components/VerifyModal/VerifyPhoneModal';
import { VesselFormFields } from './VesselFormFields';
import { Vessel } from 'types/Vessel';
import { VerifyEmailModal } from 'app/components/VerifyModal/VerifyEmailModal';

const fieldsValidate = {
    STATELINE: 'isVerifiedSatelliteNumber',
    ONBOARD_PHONE: 'isVerifiedOnboardPhone'
}

export const VesselForm = () => {
    const history = useHistory();
    const { t } = useTranslation();
    const location = useLocation();
    const [form] = useForm();
    const { id } = useParams<{ id: string }>();
    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
    const [vessel, setVessel] = React.useState<Partial<Vessel>>({});
    const [formChanged, setFormChanged] = React.useState<boolean>(false);
    const [showRemovePhotoModal, setShowRemovePhotoModal] = React.useState<boolean>(false);
    const [showRemoveDeckPlanModal, setShowRemoveDeckPlanModal] = React.useState<boolean>(false);
    const [showRemoveHullDiagram, setShowRemoveHullDiagram] = React.useState<boolean>(false);
    const [showVerifyOnboardPhoneModal, setShowVerifyOnboardPhoneModal] = React.useState<boolean>(false);
    const [showVerifySatellitePhoneModal, setShowVerifySatellitePhoneModal] = React.useState<boolean>(false);
    const [showVerifyOnboardEmailModal, setShowVerifyOnboardEmailModal] = React.useState<boolean>(false);
    const [isSaving, setIsSaving] = React.useState<boolean>(false);
    const [mode, setMode] = React.useState<string>(MODE.CREATE);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const onFinish = async (values) => {
        let response;
        const { admins } = values;
        const editors = admins?.map(item => JSON.parse(item)) || [];
        const form = new FormData();

        setIsSaving(true);

        Object.entries(values).forEach(([key, value]: any) => {
            if (['onboardPhone', 'satelliteNumber'].includes(key) && !String(value).includes('+') && value) {
                form.append(key, '+' + value);
            } else if (['photo', 'deckPlan', 'hullDiagram'].includes(key)) {
                if (value instanceof File) {
                    form.append(key, value);
                }
            } else {
                if ('onboardEmail' === key && !value) return;
                else {
                    form.append(key, value || '');
                }
            }
        });

        if (editors && Array.isArray(editors)) {
            const groupEditors: any = []
            if (editors.some(item => {
                if (item.type === AdminType.GROUP) {
                    groupEditors.push({
                        groupId: item.id,
                        isIndividualAssignment: item.isIndividualAssignment
                    })
                    return true;
                }

                return false;
            })) {
                form.append(`groupEditorsJson`, JSON.stringify(groupEditors));
            }
            editors.filter(item => item.type === AdminType.INDIVIDUAL).forEach((item, index) => {
                form.append(`editors[${index}]`, item.id);
            });
        }

        if (mode === MODE.CREATE)
            response = await createMultipart(form);
        else
            response = await updateMultipart(id, form);

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
            initModeAndData();
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
                    ...response.data,
                    admins: [...response.data?.editors.map(editor => JSON.stringify({
                        type: AdminType.INDIVIDUAL,
                        id: editor.id,
                        avatar: editor.avatar,
                        name: editor.name,
                    })), ...response.data?.groupEditors.map(editor => JSON.stringify({
                        type: AdminType.GROUP,
                        id: editor.id,
                        avatar: editor.groupImage,
                        name: editor.groupName,
                        isIndividualAssignment: false
                    }))],
                });
            } else {
                history.push('/404');
            }
        }
    }

    const onVesselDeleted = () => {
        history.push('/boats');
    }

    React.useEffect(() => {
        initModeAndData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const canDeleteVessel = () => {
        return vessel.createdById === localStorage.getItem('user_id');
    }

    const removePhoto = async () => {
        setIsLoading(true);
        const response = await removePhotos(vessel.id!, {
            isDeletePhoto: true
        });
        setIsLoading(false);

        if (response.success) {
            setVessel({
                ...vessel,
                photo: null
            });
        } else {
            showToastMessageOnRequestError(response.error);
        }

        setShowRemovePhotoModal(false);
    }

    const removeDeckPlan = async () => {
        setIsLoading(true);
        const response = await removePhotos(vessel.id!, {
            isDeleteDeckPlan: true
        });
        setIsLoading(false);

        if (response.success) {
            setVessel({
                ...vessel,
                deckPlan: null
            });
        } else {
            showToastMessageOnRequestError(response.error);
        }

        setShowRemoveDeckPlanModal(false);
    }

    const removeHullDiagram = async () => {
        setIsLoading(true);
        const response = await removePhotos(vessel.id!, {
            isDeleteHullDiagram: true
        });
        setIsLoading(false);

        if (response.success) {
            setVessel({
                ...vessel,
                hullDiagram: null
            });
        } else {
            showToastMessageOnRequestError(response.error);
        }

        setShowRemoveHullDiagram(false);
    }

    const verifyPhone = async (field, code) => {
        const response = await verifyPhones(vessel.id!, field, code);

        if (response.success) {
            toast.success(t(translations.vessel_create_update_page.successfully_verified_phone_number));
        } else {
            showToastMessageOnRequestError(response.error);
        }

        setShowVerifyOnboardPhoneModal(false);
        setShowVerifySatellitePhoneModal(false);
        initModeAndData();
    }

    const sendVerificationCode = async (field) => {
        let response;
        if (fieldsValidate.ONBOARD_PHONE === field) {
            response = await sendPhoneVerification(vessel.id!, 'ONBOARD_PHONE');
        } else {
            response = await sendPhoneVerification(vessel.id!, 'SATELLITE');
        }

        if (response.success) {
            toast.success(t(translations.vessel_create_update_page.please_check_you_phone_for_verification));
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const performVerifyOnboardEmail = async (code) => {
        const response = await verifyOnboardEmail(vessel.id, code);

        if (response.success) {
            toast.success(t(translations.vessel_create_update_page.successfully_verified_onboard_email));
        } else {
            showToastMessageOnRequestError(response.error);
        }

        setShowVerifyOnboardEmailModal(false);
        initModeAndData();
    }

    const performSendVerifyOnboardEmailCode = async () => {
        const response = await sendOnboardEmailCode(vessel.id);

        if (response.success) {
            toast.success(t(translations.vessel_create_update_page.please_check_you_email_for_verification));
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (
        <Wrapper>
            <DeleteVesselModal
                vessel={vessel}
                onVesselDeleted={onVesselDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />
            <ConfirmModal
                loading={isLoading}
                showModal={showRemovePhotoModal}
                onCancel={() => setShowRemovePhotoModal(false)}
                title={t(translations.vessel_create_update_page.remove_photo)}
                content={t(translations.vessel_create_update_page.are_you_sure_you_want_to_remove_boat_photo)}
                onOk={removePhoto} />
            <ConfirmModal
                loading={isLoading}
                showModal={showRemoveDeckPlanModal}
                onCancel={() => setShowRemoveDeckPlanModal(false)}
                title={t(translations.vessel_create_update_page.remove_deck_plan)}
                content={t(translations.vessel_create_update_page.are_you_sure_you_want_to_remove_deck_plan)}
                onOk={removeDeckPlan} />
            <ConfirmModal
                loading={isLoading}
                showModal={showRemoveHullDiagram}
                onCancel={() => setShowRemoveHullDiagram(false)}
                title={t(translations.vessel_create_update_page.remove_hull_diagram)}
                content={t(translations.vessel_create_update_page.are_you_sure_you_want_to_remove_hull_diagram)}
                onOk={removeHullDiagram} />
            <VerifyPhoneModal verifyPhone={(code) => verifyPhone('ONBOARD_PHONE', code)} sendPhoneVerification={sendVerificationCode} showPhoneVerifyModal={showVerifyOnboardPhoneModal} setShowPhoneVerifyModal={setShowVerifyOnboardPhoneModal} />
            <VerifyPhoneModal verifyPhone={(code) => verifyPhone('SATELLITE', code)} sendPhoneVerification={sendVerificationCode} showPhoneVerifyModal={showVerifySatellitePhoneModal} setShowPhoneVerifyModal={setShowVerifySatellitePhoneModal} />
            <VerifyEmailModal verifyCode={(code) => performVerifyOnboardEmail(code)} sendCode={performSendVerifyOnboardEmailCode} showModal={showVerifyOnboardEmailModal} setShowModal={setShowVerifyOnboardEmailModal} />
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
                    {mode === MODE.UPDATE && canDeleteVessel() && <DeleteButton onClick={() => setShowDeleteModal(true)} danger icon={<BiTrash
                        style={{ marginRight: '5px' }}
                        size={18} />}>{t(translations.general.delete)}</DeleteButton>}

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
                        initialValues={{
                            vesselType: VesselType.FOIL_BOARD,
                            hullsCount: 1
                        }}
                    >
                        <VesselFormFields
                            setShowRemoveHullDiagram={setShowRemoveHullDiagram}
                            setShowRemovePhotoModal={setShowRemovePhotoModal}
                            setShowRemoveDeckPlanModal={setShowRemoveDeckPlanModal}
                            setShowVerifyOnboardPhoneModal={setShowVerifyOnboardPhoneModal}
                            setShowVerifySatellitePhoneModal={setShowVerifySatellitePhoneModal}
                            setShowVerifyOnboardEmailModal={setShowVerifyOnboardEmailModal}
                            sendVerificationCode={sendVerificationCode}
                            sendOnboardEmailCode={performSendVerifyOnboardEmailCode}
                            formChanged={formChanged}
                            fieldsValidate={fieldsValidate}
                            vessel={vessel} />
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
