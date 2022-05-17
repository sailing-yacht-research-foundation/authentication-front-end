import React from 'react';
import { SyrfFieldLabel, SyrfFormButton } from 'app/components/SyrfForm';
import { Form, Spin, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
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
    }, [authUser]);

    return (<StyledSyrfFormWrapper>
        <Spin spinning={isLoading}>
            <Form name="basic"
                form={form}
                onValuesChange={() => setFormHasBeenChanged(true)}
                onFinish={onFinish}>
                <Form.Item
                    // label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.are_you_a_developer)}</SyrfFieldLabel>}
                    name={'isDeveloper'}
                    valuePropName="checked">
                    <Switch />
                </Form.Item>

                <Form.Item>
                    <SyrfFormButton disabled={!formHasBeenChanged} type="primary" htmlType="submit">
                        {t(translations.profile_page.update_profile.save)}
                    </SyrfFormButton>
                </Form.Item>
            </Form>
            {authUser.developerAccountId && <DeveloperEnabledText>{t(translations.profile_page.update_profile.developer_mode_activated_account_id, { developerId: authUser.developerAccountId })}</DeveloperEnabledText>}
        </Spin>
    </StyledSyrfFormWrapper>);
}

const DeveloperEnabledText = styled.div`
    text-align: right;
    color: #00000073;
    font-size: 13px;
`