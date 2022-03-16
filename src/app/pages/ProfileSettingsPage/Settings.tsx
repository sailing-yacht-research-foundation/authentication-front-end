import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { SyrfFieldLabel, SyrfFormButton, SyrfFormTitle, SyrfFormWrapper, SyrfFormSubTitle } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { ProfileTabs } from '../ProfilePage/components/ProfileTabs';
import { Form, Spin, Switch, Row, Col, Divider } from 'antd';
import { updateProfileSettings, getUserSettings } from 'services/live-data-server/user';
import { toast } from 'react-toastify';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { UseLoginSlice } from 'app/pages/LoginPage/slice';
export const Settings = () => {

    const [formHasBeenChanged, setFormHasBeenChanged] = React.useState<boolean>(false);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const dispatch = useDispatch();

    const { actions } = UseLoginSlice();

    const { t } = useTranslation();

    const [settings, setUserSettings] = React.useState<any>({});

    const onFinish = async (values) => {
        const { euserNewFollower, euserAchievedBadge, egroupAchievedBadge, erequestedJoinGroup,
            euserInvitedToGroup, euserAddedToEventAdmin, eeventInactivityWarning, eopenEventNearbyCreated,
            eeventInactivityDeletion, euserInvitedToPrivateRegatta } = values;
        const { buserNewFollower, buserAchievedBadge, bgroupAchievedBadge, brequestedJoinGroup,
            buserInvitedToGroup, buserAddedToEventAdmin, beventInactivityWarning, bopenEventNearbyCreated,
            beventInactivityDeletion, buserInvitedToPrivateRegatta } = values;
        const { puserNewFollower, puserAchievedBadge, pgroupAchievedBadge, prequestedJoinGroup,
            puserInvitedToGroup, puserAddedToEventAdmin, peventInactivityWarning, popenEventNearbyCreated,
            peventInactivityDeletion, puserInvitedToPrivateRegatta } = values;
        const { muserNewFollower, muserAchievedBadge, mgroupAchievedBadge, mrequestedJoinGroup,
            muserInvitedToGroup, muserAddedToEventAdmin, meventInactivityWarning, mopenEventNearbyCreated,
            meventInactivityDeletion, muserInvitedToPrivateRegatta, ocsDetected } = values;

        setIsLoading(true);

        const response = await updateProfileSettings({
            emailNotificationSettings: {
                userNewFollower: euserNewFollower, userAchievedBadge: euserAchievedBadge, groupAchievedBadge: egroupAchievedBadge,
                requestedJoinGroup: erequestedJoinGroup, userInvitedToGroup: euserInvitedToGroup, userAddedToEventAdmin: euserAddedToEventAdmin,
                eventInactivityWarning: eeventInactivityWarning, openEventNearbyCreated: eopenEventNearbyCreated,
                eventInactivityDeletion: eeventInactivityDeletion, userInvitedToPrivateRegatta: euserInvitedToPrivateRegatta
            },
            browserNotificationSettings: {
                userNewFollower: buserNewFollower, userAchievedBadge: buserAchievedBadge, groupAchievedBadge: bgroupAchievedBadge,
                requestedJoinGroup: brequestedJoinGroup, userInvitedToGroup: buserInvitedToGroup, userAddedToEventAdmin: buserAddedToEventAdmin,
                eventInactivityWarning: beventInactivityWarning, openEventNearbyCreated: bopenEventNearbyCreated,
                eventInactivityDeletion: beventInactivityDeletion, userInvitedToPrivateRegatta: buserInvitedToPrivateRegatta
            },
            mobileNotificationSettings: {
                userNewFollower: muserNewFollower, userAchievedBadge: muserAchievedBadge, groupAchievedBadge: mgroupAchievedBadge,
                requestedJoinGroup: mrequestedJoinGroup, userInvitedToGroup: muserInvitedToGroup, userAddedToEventAdmin: muserAddedToEventAdmin,
                eventInactivityWarning: meventInactivityWarning, openEventNearbyCreated: mopenEventNearbyCreated,
                eventInactivityDeletion: meventInactivityDeletion, userInvitedToPrivateRegatta: muserInvitedToPrivateRegatta,
                ocsDetected
            },
            persistentNotificationSettings: {
                userNewFollower: puserNewFollower, userAchievedBadge: puserAchievedBadge, groupAchievedBadge: pgroupAchievedBadge,
                requestedJoinGroup: prequestedJoinGroup, userInvitedToGroup: puserInvitedToGroup, userAddedToEventAdmin: puserAddedToEventAdmin,
                eventInactivityWarning: peventInactivityWarning, openEventNearbyCreated: popenEventNearbyCreated,
                eventInactivityDeletion: peventInactivityDeletion, userInvitedToPrivateRegatta: puserInvitedToPrivateRegatta
            }
        });

        setIsLoading(false);

        if (response.success) {
            toast.success(t(translations.profile_page.update_profile.upload_profile_picture_successfully));
            dispatch(actions.getUser());
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const getSettings = async () => {
        setIsLoading(true);
        const response = await getUserSettings();
        setIsLoading(false);

        if (response.success) {
            setUserSettings(response.data);
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    React.useEffect(() => {
        getSettings();
    }, []);

    return (
        <Wrapper>
            <ProfileTabs />
            <SyrfFormWrapper>
                <Spin spinning={isLoading}>
                    {settings.hasOwnProperty('emailNotificationSettings') && <Form
                        name="basic"
                        onValuesChange={() => setFormHasBeenChanged(true)}
                        onFinish={onFinish}
                        initialValues={{
                            euserNewFollower: settings.emailNotificationSettings.userNewFollower, euserAchievedBadge: settings.emailNotificationSettings.userAchievedBadge,
                            egroupAchievedBadge: settings.emailNotificationSettings.groupAchievedBadge, erequestedJoinGroup: settings.emailNotificationSettings.requestedJoinGroup,
                            euserInvitedToGroup: settings.emailNotificationSettings.userInvitedToGroup, euserAddedToEventAdmin: settings.emailNotificationSettings.userAddedToEventAdmin,
                            eeventInactivityWarning: settings.emailNotificationSettings.eventInactivityWarning, eopenEventNearbyCreated: settings.emailNotificationSettings.openEventNearbyCreated,
                            eeventInactivityDeletion: settings.emailNotificationSettings.eventInactivityDeletion, euserInvitedToPrivateRegatta: settings.emailNotificationSettings.userInvitedToPrivateRegatta,
                            
                            buserNewFollower: settings.browserNotificationSettings.userNewFollower, buserAchievedBadge: settings.browserNotificationSettings.userAchievedBadge,
                            bgroupAchievedBadge: settings.browserNotificationSettings.groupAchievedBadge, brequestedJoinGroup: settings.browserNotificationSettings.requestedJoinGroup,
                            buserInvitedToGroup: settings.browserNotificationSettings.userInvitedToGroup, buserAddedToEventAdmin: settings.browserNotificationSettings.userAddedToEventAdmin,
                            beventInactivityWarning: settings.browserNotificationSettings.eventInactivityWarning, bopenEventNearbyCreated: settings.browserNotificationSettings.openEventNearbyCreated,
                            beventInactivityDeletion: settings.browserNotificationSettings.eventInactivityDeletion, buserInvitedToPrivateRegatta: settings.browserNotificationSettings.userInvitedToPrivateRegatta,
                            
                            puserNewFollower: settings.persistentNotificationSettings.userNewFollower, puserAchievedBadge: settings.persistentNotificationSettings.userAchievedBadge,
                            pgroupAchievedBadge: settings.persistentNotificationSettings.groupAchievedBadge, prequestedJoinGroup: settings.persistentNotificationSettings.requestedJoinGroup,
                            puserInvitedToGroup: settings.persistentNotificationSettings.userInvitedToGroup, puserAddedToEventAdmin: settings.persistentNotificationSettings.userAddedToEventAdmin,
                            peventInactivityWarning: settings.persistentNotificationSettings.eventInactivityWarning, popenEventNearbyCreated: settings.persistentNotificationSettings.openEventNearbyCreated,
                            peventInactivityDeletion: settings.persistentNotificationSettings.eventInactivityDeletion, puserInvitedToPrivateRegatta: settings.persistentNotificationSettings.userInvitedToPrivateRegatta,
                            
                            muserNewFollower: settings.mobileNotificationSettings.userNewFollower, muserAchievedBadge: settings.mobileNotificationSettings.userAchievedBadge,
                            mgroupAchievedBadge: settings.mobileNotificationSettings.groupAchievedBadge, mrequestedJoinGroup: settings.mobileNotificationSettings.requestedJoinGroup,
                            muserInvitedToGroup: settings.mobileNotificationSettings.userInvitedToGroup, muserAddedToEventAdmin: settings.mobileNotificationSettings.userAddedToEventAdmin,
                            meventInactivityWarning: settings.mobileNotificationSettings.eventInactivityWarning, mopenEventNearbyCreated: settings.mobileNotificationSettings.openEventNearbyCreated,
                            meventInactivityDeletion: settings.mobileNotificationSettings.eventInactivityDeletion, muserInvitedToPrivateRegatta: settings.mobileNotificationSettings.userInvitedToPrivateRegatta,
                            ocsDetected: settings.mobileNotificationSettings.ocsDetected
                        }}
                    >
                        <SyrfFormTitle>{t(translations.profile_page.update_profile.notifications)}</SyrfFormTitle>

                        <SyrfFormSubTitle>{t(translations.profile_page.update_profile.email_notification_settings)}</SyrfFormSubTitle>
                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.user_new_follower)}</SyrfFieldLabel>}
                                    name="euserNewFollower"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.user_achieved_badge)}</SyrfFieldLabel>}
                                    name="euserAchievedBadge"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.group_achieved_badge)}</SyrfFieldLabel>}
                                    name="egroupAchievedBadge"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.requested_join_group)}</SyrfFieldLabel>}
                                    name="erequestedJoinGroup"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.user_invited_to_group)}</SyrfFieldLabel>}
                                    name="euserInvitedToGroup"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.user_added_to_event_as_admin)}</SyrfFieldLabel>}
                                    name="euserAddedToEventAdmin"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.event_inactivity_warning)}</SyrfFieldLabel>}
                                    name="eeventInactivityWarning"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.open_event_nearby_created)}</SyrfFieldLabel>}
                                    name="eopenEventNearbyCreated"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.event_inactivity_deletion)}</SyrfFieldLabel>}
                                    name="eeventInactivityDeletion"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.user_invited_to_private_regatta)}</SyrfFieldLabel>}
                                    name="euserInvitedToPrivateRegatta"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider />

                        <SyrfFormSubTitle>{t(translations.profile_page.update_profile.browser_notification_settings)}</SyrfFormSubTitle>
                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.user_new_follower)}</SyrfFieldLabel>}
                                    name="buserNewFollower"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.user_achieved_badge)}</SyrfFieldLabel>}
                                    name="buserAchievedBadge"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.group_achieved_badge)}</SyrfFieldLabel>}
                                    name="bgroupAchievedBadge"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.requested_join_group)}</SyrfFieldLabel>}
                                    name="brequestedJoinGroup"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.user_invited_to_group)}</SyrfFieldLabel>}
                                    name="buserInvitedToGroup"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.user_added_to_event_as_admin)}</SyrfFieldLabel>}
                                    name="buserAddedToEventAdmin"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.event_inactivity_warning)}</SyrfFieldLabel>}
                                    name="beventInactivityWarning"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.open_event_nearby_created)}</SyrfFieldLabel>}
                                    name="bopenEventNearbyCreated"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.event_inactivity_deletion)}</SyrfFieldLabel>}
                                    name="beventInactivityDeletion"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.user_invited_to_private_regatta)}</SyrfFieldLabel>}
                                    name="buserInvitedToPrivateRegatta"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider />

                        <SyrfFormSubTitle>{t(translations.profile_page.update_profile.mobile_notification_settings)}</SyrfFormSubTitle>
                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.user_new_follower)}</SyrfFieldLabel>}
                                    name="muserNewFollower"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.user_achieved_badge)}</SyrfFieldLabel>}
                                    name="muserAchievedBadge"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.group_achieved_badge)}</SyrfFieldLabel>}
                                    name="mgroupAchievedBadge"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.requested_join_group)}</SyrfFieldLabel>}
                                    name="mrequestedJoinGroup"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.user_invited_to_group)}</SyrfFieldLabel>}
                                    name="muserInvitedToGroup"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.user_added_to_event_as_admin)}</SyrfFieldLabel>}
                                    name="muserAddedToEventAdmin"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.event_inactivity_warning)}</SyrfFieldLabel>}
                                    name="meventInactivityWarning"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.open_event_nearby_created)}</SyrfFieldLabel>}
                                    name="mopenEventNearbyCreated"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.event_inactivity_deletion)}</SyrfFieldLabel>}
                                    name="meventInactivityDeletion"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.user_invited_to_private_regatta)}</SyrfFieldLabel>}
                                    name="muserInvitedToPrivateRegatta"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.ocs_detected)}</SyrfFieldLabel>}
                            name="ocsDetected"
                            valuePropName="checked">
                            <Switch />
                        </Form.Item>

                        <Divider />

                        <SyrfFormSubTitle>{t(translations.profile_page.update_profile.persistent_notification_settings)}</SyrfFormSubTitle>
                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.user_new_follower)}</SyrfFieldLabel>}
                                    name="puserNewFollower"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.user_achieved_badge)}</SyrfFieldLabel>}
                                    name="puserAchievedBadge"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.group_achieved_badge)}</SyrfFieldLabel>}
                                    name="pgroupAchievedBadge"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.requested_join_group)}</SyrfFieldLabel>}
                                    name="prequestedJoinGroup"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.user_invited_to_group)}</SyrfFieldLabel>}
                                    name="puserInvitedToGroup"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.user_added_to_event_as_admin)}</SyrfFieldLabel>}
                                    name="puserAddedToEventAdmin"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.event_inactivity_warning)}</SyrfFieldLabel>}
                                    name="peventInactivityWarning"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.open_event_nearby_created)}</SyrfFieldLabel>}
                                    name="popenEventNearbyCreated"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.event_inactivity_deletion)}</SyrfFieldLabel>}
                                    name="peventInactivityDeletion"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.user_invited_to_private_regatta)}</SyrfFieldLabel>}
                                    name="puserInvitedToPrivateRegatta"
                                    valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item>
                            <SyrfFormButton disabled={!formHasBeenChanged} type="primary" htmlType="submit">
                                {t(translations.profile_page.update_profile.save)}
                            </SyrfFormButton>
                        </Form.Item>
                    </Form>}
                </Spin>
            </SyrfFormWrapper>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 132px;
    align-items: center;
    width: 100%;
    position: relative;
    padding-bottom: 50px;
`;
