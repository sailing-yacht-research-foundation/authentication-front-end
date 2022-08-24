import React from 'react';
import { SyrfFieldLabel, SyrfFormButton } from 'app/components/SyrfForm';
import { Form, Spin, Switch } from 'antd';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { StyledSyrfFormWrapper } from './Settings';
import { switchDeveloperOption } from 'services/live-data-server/user';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { UseLoginSlice } from '../LoginPage/slice';
import { selectUser } from '../LoginPage/slice/selectors';
import { useForm } from 'antd/lib/form/Form';
import styled from 'styled-components';
import { BorderedButton } from 'app/components/SyrfGeneral';

export const DeveloperOptionSetting = () => {

    const { t } = useTranslation();

    const [formHasBeenChanged, setFormHasBeenChanged] = React.useState<boolean>(false);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const dispatch = useDispatch();

    const { actions } = UseLoginSlice();

    const authUser = useSelector(selectUser);

    const [form] = useForm();

    const onFinish = async (values) => {

        const { isDeveloper } = values;

        setIsLoading(true);
        const response = await switchDeveloperOption(!!isDeveloper);
        setIsLoading(false);

        if (response.success) {
            toast.success(t(translations.general.your_action_is_successful));
            dispatch(actions.getUser());
            dispatch(actions.getNewToken());
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    React.useEffect(() => {
        if (authUser.developerAccountId) {
            form.setFieldsValue({
                isDeveloper: true
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authUser]);

    return (<StyledSyrfFormWrapper>
        <Spin spinning={isLoading}>
            <Form name="basic"
                form={form}
                onValuesChange={() => setFormHasBeenChanged(true)}
                onFinish={onFinish}>
                <Form.Item
                    label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.enable_developer_feature)}</SyrfFieldLabel>}
                    name={'isDeveloper'}
                    valuePropName="checked">
                    <Switch />
                </Form.Item>

                <Form.Item>
                    <SyrfFormButton disabled={!formHasBeenChanged} type="primary" htmlType="submit">
                        {t(translations.general.save)}
                    </SyrfFormButton>
                </Form.Item>
            </Form>
            {authUser.developerAccountId && <DeveloperEnabledText>{t(translations.profile_page.update_profile.developer_mode_activated_account_id, { developerId: authUser.developerAccountId })}</DeveloperEnabledText>}

            <DeveloperIntroductionSection>
                <div>
                    <BorderedButton onClick={() => window.open('https://developers.syrf.io/', '_blank')}>{t(translations.profile_page.update_profile.visit_developer_documentation)}</BorderedButton>
                </div>
                <DeveloperIntroductionDescription>
                    <Trans
                        i18nKey={translations.profile_page.update_profile.developer_description} // optional -> fallbacks to defaults if not provided
                        defaults="Don’t forget to get your developer token by following the instructions in the developer documentation. You should also join our <a target='_blank' href='https://discord.com/invite/EfvufEsDua'>Discord group for support!</a>" // eslint-disable-next-line
                        components={{ a:  <a /> }}
                    />
                </DeveloperIntroductionDescription>
            </DeveloperIntroductionSection>
        </Spin>
    </StyledSyrfFormWrapper>);
}

const DeveloperIntroductionDescription = styled.span`
    margin-top: 15px;
    color: #00000073;
`;

const DeveloperEnabledText = styled.div`
    text-align: right;
    color: #00000073;
    font-size: 13px;
`;

const DeveloperIntroductionSection = styled.div`
    margin-top: 30px;
    padding: 0 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;
