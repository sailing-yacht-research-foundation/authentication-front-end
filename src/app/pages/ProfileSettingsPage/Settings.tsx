import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { SyrfFieldLabel, SyrfFormButton, SyrfFormTitle, SyrfFormWrapper, SyrfFormSubTitle } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { ProfileTabs } from '../ProfilePage/components/ProfileTabs';
import { Form, Spin, Switch, Row, Col, Divider } from 'antd';
import { updateProfileSettings, getUserSettings } from 'services/live-data-server/user';
import { toast } from 'react-toastify';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { UseLoginSlice } from 'app/pages/LoginPage/slice';
import { media } from 'styles/media';
export const Settings = () => {

    const [formHasBeenChanged, setFormHasBeenChanged] = React.useState<boolean>(false);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const dispatch = useDispatch();

    const { actions } = UseLoginSlice();

    const { t } = useTranslation();

    const [settings, setUserSettings] = React.useState<any>({});

    const emailSettingFields = ['euserNewFollower', 'euserAchievedBadge', 'egroupAchievedBadge', 'erequestedJoinGroup',
        'euserInvitedToGroup', 'euserAddedToEventAdmin', 'eeventInactivityWarning', 'eopenEventNearbyCreated',
        'eeventInactivityDeletion', 'euserInvitedToPrivateRegatta'];

    const browserSettingFields = ['buserNewFollower', 'buserAchievedBadge', 'bgroupAchievedBadge', 'brequestedJoinGroup',
        'buserInvitedToGroup', 'buserAddedToEventAdmin', 'beventInactivityWarning', 'bopenEventNearbyCreated',
        'beventInactivityDeletion', 'buserInvitedToPrivateRegatta'];

    const persistentSettingFields = ['puserNewFollower', 'puserAchievedBadge', 'pgroupAchievedBadge', 'prequestedJoinGroup',
        'puserInvitedToGroup', 'puserAddedToEventAdmin', 'peventInactivityWarning', 'popenEventNearbyCreated',
        'peventInactivityDeletion', 'puserInvitedToPrivateRegatta'];

    const mobileSettingFields = ['muserNewFollower', 'muserAchievedBadge', 'mgroupAchievedBadge', 'mrequestedJoinGroup',
        'muserInvitedToGroup', 'muserAddedToEventAdmin', 'meventInactivityWarning', 'mopenEventNearbyCreated',
        'meventInactivityDeletion', 'muserInvitedToPrivateRegatta', 'ocsDetected', 'newCompetitionAddedToEvent', 'competitionStartingSoon'];

    const onFinish = async (values) => {

        setIsLoading(true);

        const response = await updateProfileSettings({
            emailNotificationSettings: {
                userNewFollower: values['euserNewFollower'], userAchievedBadge: values['euserAchievedBadge'], groupAchievedBadge: values['egroupAchievedBadge'],
                requestedJoinGroup: values['erequestedJoinGroup'], userInvitedToGroup: values['euserInvitedToGroup'], userAddedToEventAdmin: values['euserAddedToEventAdmin'],
                eventInactivityWarning: values['eeventInactivityWarning'], openEventNearbyCreated: values['eopenEventNearbyCreated'],
                eventInactivityDeletion: values['eeventInactivityDeletion'], userInvitedToPrivateRegatta: values['euserInvitedToPrivateRegatta']
            },
            browserNotificationSettings: {
                userNewFollower: values['buserNewFollower'], userAchievedBadge: values['buserAchievedBadge'], groupAchievedBadge: values['bgroupAchievedBadge'],
                requestedJoinGroup: values['brequestedJoinGroup'], userInvitedToGroup: values['buserInvitedToGroup'], userAddedToEventAdmin: values['buserAddedToEventAdmin'],
                eventInactivityWarning: values['beventInactivityWarning'], openEventNearbyCreated: values['bopenEventNearbyCreated'],
                eventInactivityDeletion: values['beventInactivityDeletion'], userInvitedToPrivateRegatta: values['buserInvitedToPrivateRegatta']
            },
            mobileNotificationSettings: {
                userNewFollower: values['muserNewFollower'], userAchievedBadge: values['muserAchievedBadge'], groupAchievedBadge: values['mgroupAchievedBadge'],
                requestedJoinGroup: values['mrequestedJoinGroup'], userInvitedToGroup: values['muserInvitedToGroup'], userAddedToEventAdmin: values['muserAddedToEventAdmin'],
                eventInactivityWarning: values['meventInactivityWarning'], openEventNearbyCreated: values['mopenEventNearbyCreated'],
                eventInactivityDeletion: values['meventInactivityDeletion'], userInvitedToPrivateRegatta: values['muserInvitedToPrivateRegatta'],
                ocsDetected: values['ocsDetected'], newCompetitionAddedToEvent: values['newCompetitionAddedToEvent'], competitionStartingSoon: values['competitionStartingSoon']
            },
            persistentNotificationSettings: {
                userNewFollower: values['puserNewFollower'], userAchievedBadge: values['puserAchievedBadge'], groupAchievedBadge: values['pgroupAchievedBadge'],
                requestedJoinGroup: values['prequestedJoinGroup'], userInvitedToGroup: values['puserInvitedToGroup'], userAddedToEventAdmin: values['puserAddedToEventAdmin'],
                eventInactivityWarning: values['peventInactivityWarning'], openEventNearbyCreated: values['popenEventNearbyCreated'],
                eventInactivityDeletion: values['peventInactivityDeletion'], userInvitedToPrivateRegatta: values['puserInvitedToPrivateRegatta']
            }
        });

        setIsLoading(false);

        if (response.success) {
            toast.success(t(translations.general.your_action_is_successful));
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

    const renderFormFieldTitle = (field) => {
        const fields = [{ key: "ocsDetected", title: t(translations.profile_page.update_profile.ocs_detected) },
        { key: "userNewFollower", title: t(translations.profile_page.update_profile.user_new_follower) },
        { key: "requestedJoinGroup", title: t(translations.profile_page.update_profile.requested_join_group) },
        { key: "userAchievedBadge", title: t(translations.profile_page.update_profile.user_achieved_badge) },
        { key: "groupAchievedBadge", title: t(translations.profile_page.update_profile.group_achieved_badge) },
        { key: "userInvitedToGroup", title: t(translations.profile_page.update_profile.user_invited_to_group) },
        { key: "eventInactivityWarning", title: t(translations.profile_page.update_profile.event_inactivity_warning) },
        { key: "userAddedToEventAdmin", title: t(translations.profile_page.update_profile.user_added_to_event_as_admin) },
        { key: "openEventNearbyCreated", title: t(translations.profile_page.update_profile.open_event_nearby_created) },
        { key: "eventInactivityDeletion", title: t(translations.profile_page.update_profile.event_inactivity_deletion) },
        { key: "competitionStartingSoon", title: t(translations.profile_page.update_profile.race_starts_soon) },
        { key: "newCompetitionAddedToEvent", title: t(translations.profile_page.update_profile.new_race_added_to_event) },
        { key: "userInvitedToPrivateRegatta", title: t(translations.profile_page.update_profile.user_invited_to_regatta) }];

        for (let i = 0; i < fields.length; i++) {
            if (field.includes(fields[i].key)) {
                return fields[i].title;
            }
        }
    }

    const renderFormFields = (fields: string[]) => {
        return fields.reduce(
            function (accumulator: any[], currentValue, currentIndex, array: any[]) {
                if (currentIndex % 2 === 0)
                    accumulator.push(array.slice(currentIndex, currentIndex + 2));
                return accumulator;
            }, []).map(fields => (
                <Row gutter={50}>
                    {fields.map(field => <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                            label={<SyrfFieldLabel>{renderFormFieldTitle(field)}</SyrfFieldLabel>}
                            name={field}
                            valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>)}
                </Row>
            ))

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
                            ocsDetected: settings.mobileNotificationSettings.ocsDetected, newCompetitionAddedToEvent: settings.mobileNotificationSettings.newCompetitionAddedToEvent,
                            competitionStartingSoon: settings.mobileNotificationSettings.competitionStartingSoon
                        }}
                    >
                        <SyrfFormTitle>{t(translations.profile_page.update_profile.notifications)}</SyrfFormTitle>

                        <SyrfFormSubTitle>{t(translations.profile_page.update_profile.email_notification_settings)}</SyrfFormSubTitle>
                        {renderFormFields(emailSettingFields)}

                        <Divider />

                        <SyrfFormSubTitle>{t(translations.profile_page.update_profile.browser_notification_settings)}</SyrfFormSubTitle>
                        {renderFormFields(browserSettingFields)}

                        <Divider />

                        <SyrfFormSubTitle>{t(translations.profile_page.update_profile.mobile_notification_settings)}</SyrfFormSubTitle>
                        {renderFormFields(mobileSettingFields)}

                        <Divider />

                        <SyrfFormSubTitle>{t(translations.profile_page.update_profile.persistent_notification_settings)}</SyrfFormSubTitle>
                        {renderFormFields(persistentSettingFields)}

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

    .ant-form-item-control-input {
        text-align: right;
    }

    .ant-form  {
        .ant-form-item {
            .ant-form-item-control {
                flex: 1 1 !important;
            }
            .ant-form-item-label {
                flex: 1 1 !important;
                label {
                    line-height: 1.5em !important;
                }
            }
        }
    }

    ${media.large`
        .ant-form-item-control-input {
            text-align: none;
        }

        .ant-form  {
            .ant-form-item {
                .ant-form-item-control {
                    flex: 1 1 !important;
                }
                .ant-form-item-label {
                   text-align: left;
                   flex: none !important;
                }
            }
        }
    `};
`;
