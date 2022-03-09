import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { SyrfFieldLabel, SyrfFormButton, SyrfFormTitle, SyrfFormWrapper } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { ProfileTabs } from '../ProfilePage/components/ProfileTabs';
import { Form, Spin, Switch } from 'antd';
import { updateProfileSettings } from 'services/live-data-server/user';
import { toast } from 'react-toastify';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { UseLoginSlice } from 'app/pages/LoginPage/slice';
export const Settings = () => {

    const authUser = useSelector(selectUser);

    const [formHasBeenChanged, setFormHasBeenChanged] = React.useState<boolean>(false);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const dispatch = useDispatch();

    const { actions } = UseLoginSlice();

    const { t } = useTranslation();

    const onFinish = async (values) => {
        const { optInMobileNotification, optInEmailNotification } = values;

        setIsLoading(true);

        const response = await updateProfileSettings({
            optInMobileNotification: !!optInMobileNotification,
            optInEmailNotification: !!optInEmailNotification,
            isStreamer: !!authUser.isStreamer // we leave it for now 'cause Jon didn't mention anything about it.
        });

        setIsLoading(false);

        if (response.success) {
            toast.success(t(translations.profile_page.update_profile.upload_profile_picture_successfully));
            dispatch(actions.getUser());
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (
        <Wrapper>
            <ProfileTabs />
            <SyrfFormWrapper>
                <Spin spinning={isLoading}>
                    <SyrfFormTitle>{t(translations.profile_page.update_profile.notifications)}</SyrfFormTitle>
                    {authUser.id && <Form
                        name="basic"
                        onValuesChange={() => setFormHasBeenChanged(true)}
                        onFinish={onFinish}
                        initialValues={{
                            optInMobileNotification: authUser.optInMobileNotification,
                            optInEmailNotification: authUser.optInEmailNotification,
                        }}
                    >
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.turn_on_mobile_notification)}</SyrfFieldLabel>}
                            name="optInMobileNotification"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>

                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.turn_on_email_notification)}</SyrfFieldLabel>}
                            name="optInEmailNotification"
                            valuePropName="checked">
                            <Switch />
                        </Form.Item>

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
