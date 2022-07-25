import React from 'react';
import { useDispatch } from 'react-redux';
import { SyrfFieldLabel, SyrfFormButton, SyrfFormSubTitle } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { Form, Spin, Switch, Row, Col, Divider } from 'antd';
import { updateProfileSettings, getUserSettings } from 'services/live-data-server/user';
import { toast } from 'react-toastify';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { UseLoginSlice } from 'app/pages/LoginPage/slice';
import { StyledSyrfFormWrapper } from './Settings';

export const NotificationSettings = () => {
    const [formHasBeenChanged, setFormHasBeenChanged] = React.useState<boolean>(false);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const dispatch = useDispatch();

    const { actions } = UseLoginSlice();

    const { t } = useTranslation();

    const [settings, setUserSettings] = React.useState<any>({});

    const emailSettingFields = ['euserNewFollower', 'euserAchievedBadge', 'egroupAchievedBadge', 'erequestedJoinGroup',
        'euserInvitedToGroup', 'euserAddedToEventAdmin', 'eeventInactivityWarning', 'eopenEventNearbyCreated',
        'eeventInactivityDeletion', 'euserInvitedToPrivateRegatta', 'ekudosReceived', 'eeventMessagesReceived', 'esimulationDeletion', 'enewEventDocumentUploaded'];

    const browserSettingFields = ['buserNewFollower', 'buserAchievedBadge', 'bgroupAchievedBadge', 'brequestedJoinGroup',
        'buserInvitedToGroup', 'buserAddedToEventAdmin', 'beventInactivityWarning', 'bopenEventNearbyCreated',
        'beventInactivityDeletion', 'buserInvitedToPrivateRegatta', 'bkudosReceived', 'bsimulationDeletion', 'beventMessagesReceived', 'bnewEventDocumentUploaded'];

    const persistentSettingFields = ['puserNewFollower', 'puserAchievedBadge', 'pgroupAchievedBadge', 'prequestedJoinGroup',
        'puserInvitedToGroup', 'puserAddedToEventAdmin', 'peventInactivityWarning', 'popenEventNearbyCreated',
        'peventInactivityDeletion', 'puserInvitedToPrivateRegatta', 'pkudosReceived', 'peventMessagesReceived', 'psimulationDeletion', 'pnewEventDocumentUploaded'];

    const mobileSettingFields = ['muserNewFollower', 'muserAchievedBadge', 'mgroupAchievedBadge', 'mrequestedJoinGroup',
        'muserInvitedToGroup', 'muserAddedToEventAdmin', 'meventInactivityWarning', 'mopenEventNearbyCreated',
        'meventInactivityDeletion', 'muserInvitedToPrivateRegatta', 'newCompetitionAddedToEvent', 'competitionStartingSoon', 'mkudosReceived', 'meventMessagesReceived', 'msimulationDeletion', 'mnewEventDocumentUploaded'];

    const onFinish = async (values) => {

        setIsLoading(true);

        const response = await updateProfileSettings({
            emailNotificationSettings: {
                userNewFollower: values['euserNewFollower'], userAchievedBadge: values['euserAchievedBadge'], groupAchievedBadge: values['egroupAchievedBadge'],
                requestedJoinGroup: values['erequestedJoinGroup'], userInvitedToGroup: values['euserInvitedToGroup'], userAddedToEventAdmin: values['euserAddedToEventAdmin'],
                eventInactivityWarning: values['eeventInactivityWarning'], openEventNearbyCreated: values['eopenEventNearbyCreated'],
                eventInactivityDeletion: values['eeventInactivityDeletion'], userInvitedToPrivateRegatta: values['euserInvitedToPrivateRegatta'],
                kudosReceived: values['ekudosReceived'], eventMessagesReceived: values['eeventMessagesReceived'], simulationDeletion: values['esimulationDeletion'], newEventDocumentUploaded: values['enewEventDocumentUploaded']
            },
            browserNotificationSettings: {
                userNewFollower: values['buserNewFollower'], userAchievedBadge: values['buserAchievedBadge'], groupAchievedBadge: values['bgroupAchievedBadge'],
                requestedJoinGroup: values['brequestedJoinGroup'], userInvitedToGroup: values['buserInvitedToGroup'], userAddedToEventAdmin: values['buserAddedToEventAdmin'],
                eventInactivityWarning: values['beventInactivityWarning'], openEventNearbyCreated: values['bopenEventNearbyCreated'],
                eventInactivityDeletion: values['beventInactivityDeletion'], userInvitedToPrivateRegatta: values['buserInvitedToPrivateRegatta'],
                kudosReceived: values['bkudosReceived'], eventMessagesReceived: values['beventMessagesReceived'], simulationDeletion: values['bsimulationDeletion'], newEventDocumentUploaded: values['bnewEventDocumentUploaded']
            },
            mobileNotificationSettings: {
                userNewFollower: values['muserNewFollower'], userAchievedBadge: values['muserAchievedBadge'], groupAchievedBadge: values['mgroupAchievedBadge'],
                requestedJoinGroup: values['mrequestedJoinGroup'], userInvitedToGroup: values['muserInvitedToGroup'], userAddedToEventAdmin: values['muserAddedToEventAdmin'],
                eventInactivityWarning: values['meventInactivityWarning'], openEventNearbyCreated: values['mopenEventNearbyCreated'],
                eventInactivityDeletion: values['meventInactivityDeletion'], userInvitedToPrivateRegatta: values['muserInvitedToPrivateRegatta'],
                newCompetitionAddedToEvent: values['newCompetitionAddedToEvent'], competitionStartingSoon: values['competitionStartingSoon'],
                kudosReceived: values['mkudosReceived'], eventMessagesReceived: values['meventMessagesReceived'], simulationDeletion: values['msimulationDeletion'], newEventDocumentUploaded: values['mnewEventDocumentUploaded']
            },
            persistentNotificationSettings: {
                userNewFollower: values['puserNewFollower'], userAchievedBadge: values['puserAchievedBadge'], groupAchievedBadge: values['pgroupAchievedBadge'],
                requestedJoinGroup: values['prequestedJoinGroup'], userInvitedToGroup: values['puserInvitedToGroup'], userAddedToEventAdmin: values['puserAddedToEventAdmin'],
                eventInactivityWarning: values['peventInactivityWarning'], openEventNearbyCreated: values['popenEventNearbyCreated'],
                eventInactivityDeletion: values['peventInactivityDeletion'], userInvitedToPrivateRegatta: values['puserInvitedToPrivateRegatta'],
                kudosReceived: values['pkudosReceived'], eventMessagesReceived: values['peventMessagesReceived'], simulationDeletion: values['psimulationDeletion'], newEventDocumentUploaded: values['pnewEventDocumentUploaded']
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
        const fields = [
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
        { key: "kudosReceived", title: t(translations.settings_page.kudos_received) },
        { key: "newEventDocumentUploaded", title: t(translations.settings_page.new_event_document_uploaded) },
        { key: "simulationDeletion", title: t(translations.settings_page.simulation_deletion) },
        { key: "eventMessagesReceived", title: t(translations.settings_page.new_event_messages_received) },
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
                    {fields.map((field, index) => <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                            key={index}
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

    return <StyledSyrfFormWrapper>
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
                    ekudosReceived: settings.emailNotificationSettings.kudosReceived, eeventMessagesReceived: settings.emailNotificationSettings.eventMessagesReceived, esimulationDeletion: settings.emailNotificationSettings.simulationDeletion, enewEventDocumentUploaded: settings.emailNotificationSettings.newEventDocumentUploaded,

                    buserNewFollower: settings.browserNotificationSettings.userNewFollower, buserAchievedBadge: settings.browserNotificationSettings.userAchievedBadge,
                    bgroupAchievedBadge: settings.browserNotificationSettings.groupAchievedBadge, brequestedJoinGroup: settings.browserNotificationSettings.requestedJoinGroup,
                    buserInvitedToGroup: settings.browserNotificationSettings.userInvitedToGroup, buserAddedToEventAdmin: settings.browserNotificationSettings.userAddedToEventAdmin,
                    beventInactivityWarning: settings.browserNotificationSettings.eventInactivityWarning, bopenEventNearbyCreated: settings.browserNotificationSettings.openEventNearbyCreated,
                    beventInactivityDeletion: settings.browserNotificationSettings.eventInactivityDeletion, buserInvitedToPrivateRegatta: settings.browserNotificationSettings.userInvitedToPrivateRegatta,
                    bkudosReceived: settings.browserNotificationSettings.kudosReceived, beventMessagesReceived: settings.browserNotificationSettings.eventMessagesReceived, bsimulationDeletion: settings.browserNotificationSettings.simulationDeletion, bnewEventDocumentUploaded: settings.browserNotificationSettings.newEventDocumentUploaded,

                    puserNewFollower: settings.persistentNotificationSettings.userNewFollower, puserAchievedBadge: settings.persistentNotificationSettings.userAchievedBadge,
                    pgroupAchievedBadge: settings.persistentNotificationSettings.groupAchievedBadge, prequestedJoinGroup: settings.persistentNotificationSettings.requestedJoinGroup,
                    puserInvitedToGroup: settings.persistentNotificationSettings.userInvitedToGroup, puserAddedToEventAdmin: settings.persistentNotificationSettings.userAddedToEventAdmin,
                    peventInactivityWarning: settings.persistentNotificationSettings.eventInactivityWarning, popenEventNearbyCreated: settings.persistentNotificationSettings.openEventNearbyCreated,
                    peventInactivityDeletion: settings.persistentNotificationSettings.eventInactivityDeletion, puserInvitedToPrivateRegatta: settings.persistentNotificationSettings.userInvitedToPrivateRegatta,
                    pkudosReceived: settings.persistentNotificationSettings.kudosReceived, peventMessagesReceived: settings.persistentNotificationSettings.eventMessagesReceived, psimulationDeletion: settings.persistentNotificationSettings.simulationDeletion, pnewEventDocumentUploaded: settings.persistentNotificationSettings.newEventDocumentUploaded,

                    muserNewFollower: settings.mobileNotificationSettings.userNewFollower, muserAchievedBadge: settings.mobileNotificationSettings.userAchievedBadge,
                    mgroupAchievedBadge: settings.mobileNotificationSettings.groupAchievedBadge, mrequestedJoinGroup: settings.mobileNotificationSettings.requestedJoinGroup,
                    muserInvitedToGroup: settings.mobileNotificationSettings.userInvitedToGroup, muserAddedToEventAdmin: settings.mobileNotificationSettings.userAddedToEventAdmin,
                    meventInactivityWarning: settings.mobileNotificationSettings.eventInactivityWarning, mopenEventNearbyCreated: settings.mobileNotificationSettings.openEventNearbyCreated,
                    meventInactivityDeletion: settings.mobileNotificationSettings.eventInactivityDeletion, muserInvitedToPrivateRegatta: settings.mobileNotificationSettings.userInvitedToPrivateRegatta,
                    newCompetitionAddedToEvent: settings.mobileNotificationSettings.newCompetitionAddedToEvent,
                    competitionStartingSoon: settings.mobileNotificationSettings.competitionStartingSoon,
                    mkudosReceived: settings.mobileNotificationSettings.kudosReceived, meventMessagesReceived: settings.mobileNotificationSettings.eventMessagesReceived, msimulationDeletion: settings.mobileNotificationSettings.simulationDeletion, mnewEventDocumentUploaded: settings.mobileNotificationSettings.newEventDocumentUploaded,
                }}
            >

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
    </StyledSyrfFormWrapper>;
}
